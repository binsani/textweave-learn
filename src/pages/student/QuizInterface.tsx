import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCourseById, dbCourseToCardProps } from '@/hooks/useCourses';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { QuizQuestion, QuizProgress, QuizResults } from '@/components/quiz';
import { Quiz, Course, Lesson, Section, Question } from '@/types';
import { useToast } from '@/hooks/use-toast';

type QuizState = 'taking' | 'results' | 'review';

interface GradeResult {
  score: number;
  totalPoints: number;
  correctCount: number;
  totalQuestions: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  questionResults: Array<{
    questionId: string;
    correctAnswer: string;
    explanation: string | null;
    isCorrect: boolean;
    userAnswer: string | null;
    points: number;
  }>;
}

function QuizSkeleton() {
  return (
    <div className="max-w-3xl mx-auto animate-pulse space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-4 w-48" />
      <div className="space-y-4 pt-6">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
        <Skeleton className="h-14 w-full" />
      </div>
    </div>
  );
}

export default function QuizInterface() {
  const { courseId, lessonId, quizId } = useParams<{
    courseId: string;
    lessonId: string;
    quizId: string;
  }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizState, setQuizState] = useState<QuizState>('taking');
  const [gradeResult, setGradeResult] = useState<GradeResult | null>(null);

  // Fetch course and quiz from database
  const { data: dbCourse } = useCourseById(courseId);
  const course: Course | undefined = useMemo(() => dbCourse ? dbCourseToCardProps(dbCourse) : undefined, [dbCourse]);

  // Fetch quiz questions WITHOUT correct_answer/explanation (server-side grading)
  const { data: quizData } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: async () => {
      if (!quizId) return null;
      const { data: quiz, error } = await supabase
        .from('quizzes')
        .select('*, questions(id, quiz_id, type, question, options, points, order)')
        .eq('id', quizId)
        .single();
      if (error) return null;
      return {
        id: quiz.id,
        lessonId: quiz.lesson_id,
        title: quiz.title,
        description: quiz.description ?? undefined,
        passingScore: quiz.passing_score,
        timeLimit: quiz.time_limit ?? undefined,
        questions: (quiz.questions ?? [])
          .sort((a: any, b: any) => a.order - b.order)
          .map((q: any) => ({
            id: q.id,
            quizId: q.quiz_id,
            type: q.type,
            question: q.question,
            options: q.options ?? undefined,
            correctAnswer: '', // Not fetched - graded server-side
            explanation: undefined,
            points: q.points,
            order: q.order,
          })),
      } as Quiz;
    },
    enabled: !!quizId,
  });
  const quiz = quizData ?? undefined;

  // Server-side grading mutation
  const gradeMutation = useMutation({
    mutationFn: async () => {
      if (!quizId) throw new Error('No quiz ID');
      const { data, error } = await supabase.rpc('grade_quiz', {
        p_quiz_id: quizId,
        p_answers: answers,
      });
      if (error) throw error;
      return data as unknown as GradeResult;
    },
    onSuccess: (result) => {
      setGradeResult(result);
      // Merge correct answers back into quiz questions for review mode
      setQuizState('results');
    },
    onError: (error) => {
      toast({
        title: 'Error submitting quiz',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const findLesson = useCallback((): { lesson: Lesson | null; section: Section | null } => {
    if (!course) return { lesson: null, section: null };
    for (const section of course.sections) {
      const lesson = section.lessons.find((l) => l.id === lessonId);
      if (lesson) return { lesson, section };
    }
    return { lesson: null, section: null };
  }, [course, lessonId]);

  const { lesson } = findLesson();

  // Quiz calculations
  const answeredQuestions = useMemo(
    () => new Set(Object.keys(answers).map((key) => quiz?.questions.findIndex((q) => q.id === key) ?? -1).filter((i) => i >= 0)),
    [answers, quiz]
  );

  // Build review data from grade result
  const reviewData = useMemo(() => {
    if (!gradeResult) return { correctAnswers: new Set<number>() };
    const correctAnswers = new Set<number>();
    gradeResult.questionResults.forEach((r, index) => {
      if (r.isCorrect) correctAnswers.add(index);
    });
    return { correctAnswers };
  }, [gradeResult]);

  // Enrich quiz questions with correct answers for review mode
  const enrichedQuiz = useMemo(() => {
    if (!quiz || !gradeResult) return quiz;
    return {
      ...quiz,
      questions: quiz.questions.map((q) => {
        const result = gradeResult.questionResults.find((r) => r.questionId === q.id);
        return result ? { ...q, correctAnswer: result.correctAnswer, explanation: result.explanation } : q;
      }),
    };
  }, [quiz, gradeResult]);

  const passed = gradeResult?.passed ?? false;

  // Handlers
  const handleAnswerSelect = (answerId: string) => {
    if (!quiz || quizState !== 'taking') return;
    const currentQuestion = quiz.questions[currentQuestionIndex];
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answerId }));
  };

  const handleNext = () => {
    if (!quiz) return;
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    gradeMutation.mutate();
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setGradeResult(null);
    setQuizState('taking');
  };

  const handleReview = () => {
    setCurrentQuestionIndex(0);
    setQuizState('review');
  };

  const handleContinue = () => {
    if (course && lesson) {
      let foundCurrent = false;
      for (const section of course.sections) {
        for (const l of section.lessons) {
          if (foundCurrent) {
            navigate(`/learn/${courseId}/${l.id}`);
            return;
          }
          if (l.id === lessonId) {
            foundCurrent = true;
          }
        }
      }
      navigate(`/learn/${courseId}/${lessonId}`);
    }
  };

  const handleBackToLesson = () => {
    navigate(`/learn/${courseId}/${lessonId}`);
  };

  // Redirects
  if (!course) {
    return <Navigate to="/catalog" replace />;
  }

  if (!quiz || !lesson) {
    return <Navigate to={`/learn/${courseId}/${lessonId || ''}`} replace />;
  }

  const displayQuiz = quizState === 'review' && enrichedQuiz ? enrichedQuiz : quiz;
  const currentQuestion = displayQuiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quiz.questions.length - 1;
  const allAnswered = answeredQuestions.size === quiz.questions.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="container max-w-4xl mx-auto flex items-center justify-between px-4 h-14">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBackToLesson}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Lesson</span>
          </Button>

          <div className="text-center">
            <h1 className="text-sm font-medium truncate max-w-[200px] sm:max-w-none">
              {quiz.title}
            </h1>
            <p className="text-xs text-muted-foreground">{lesson.title}</p>
          </div>

          {quiz.timeLimit && quizState === 'taking' && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{quiz.timeLimit} min</span>
            </div>
          )}
          {!quiz.timeLimit && <div className="w-20" />}
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-4xl mx-auto px-4 py-8">
        {gradeMutation.isPending ? (
          <QuizSkeleton />
        ) : quizState === 'results' && gradeResult ? (
          <QuizResults
            quiz={quiz}
            score={gradeResult.score}
            totalPoints={gradeResult.totalPoints}
            correctCount={gradeResult.correctCount}
            totalQuestions={gradeResult.totalQuestions}
            passed={passed}
            onRetry={handleRetry}
            onReview={handleReview}
            onContinue={handleContinue}
          />
        ) : (
          <div className="grid lg:grid-cols-[1fr_280px] gap-8">
            {/* Question Area */}
            <Card>
              <CardContent className="p-6 sm:p-8">
                <QuizQuestion
                  question={currentQuestion}
                  questionNumber={currentQuestionIndex + 1}
                  totalQuestions={quiz.questions.length}
                  selectedAnswer={answers[currentQuestion.id] || null}
                  onAnswerSelect={handleAnswerSelect}
                  showResult={quizState === 'review'}
                  isCorrect={reviewData.correctAnswers.has(currentQuestionIndex)}
                />

                {/* Navigation */}
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="gap-2"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {quizState === 'taking' ? (
                    isLastQuestion ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={!allAnswered || gradeMutation.isPending}
                        className="gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button onClick={handleNext} className="gap-2">
                        Next
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    )
                  ) : (
                    <Button
                      onClick={() => setQuizState('results')}
                      variant="outline"
                    >
                      Back to Results
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Sidebar Progress */}
            <div className="hidden lg:block">
              <Card className="sticky top-20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Quiz Progress</CardTitle>
                </CardHeader>
                <CardContent>
                  <QuizProgress
                    currentQuestion={currentQuestionIndex}
                    totalQuestions={quiz.questions.length}
                    answeredQuestions={answeredQuestions}
                    onQuestionClick={(index) => setCurrentQuestionIndex(index)}
                    isReviewMode={quizState === 'review'}
                    correctAnswers={reviewData.correctAnswers}
                  />

                  {quizState === 'taking' && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">
                        Passing score: {quiz.passingScore}%
                      </p>
                      <Button
                        onClick={handleSubmit}
                        disabled={!allAnswered || gradeMutation.isPending}
                        className="w-full gap-2"
                      >
                        <Send className="h-4 w-4" />
                        {gradeMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
