import { useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { mockCourses, mockQuizzes } from '@/data/mockData';
import { QuizQuestion, QuizProgress, QuizResults } from '@/components/quiz';
import { Quiz, Course, Lesson, Section } from '@/types';

type QuizState = 'taking' | 'results' | 'review';

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

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [quizState, setQuizState] = useState<QuizState>('taking');
  const [isLoading, setIsLoading] = useState(false);

  // Find course, lesson, and quiz
  const course: Course | undefined = mockCourses.find((c) => c.id === courseId);
  const quiz: Quiz | undefined = mockQuizzes.find((q) => q.id === quizId);

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

  const calculateResults = useMemo(() => {
    if (!quiz) return { score: 0, totalPoints: 0, correctCount: 0, correctAnswers: new Set<number>() };

    let score = 0;
    let correctCount = 0;
    const correctAnswers = new Set<number>();

    quiz.questions.forEach((question, index) => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctAnswer) {
        score += question.points;
        correctCount++;
        correctAnswers.add(index);
      }
    });

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    return { score, totalPoints, correctCount, correctAnswers };
  }, [quiz, answers]);

  const passed = useMemo(() => {
    if (!quiz) return false;
    const percentage = (calculateResults.score / calculateResults.totalPoints) * 100;
    return percentage >= quiz.passingScore;
  }, [quiz, calculateResults]);

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
    setQuizState('results');
  };

  const handleRetry = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setQuizState('taking');
  };

  const handleReview = () => {
    setCurrentQuestionIndex(0);
    setQuizState('review');
  };

  const handleContinue = () => {
    if (course && lesson) {
      // Find next lesson
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
      // If no next lesson, go back to course
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

  const currentQuestion = quiz.questions[currentQuestionIndex];
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
        {isLoading ? (
          <QuizSkeleton />
        ) : quizState === 'results' ? (
          <QuizResults
            quiz={quiz}
            score={calculateResults.score}
            totalPoints={calculateResults.totalPoints}
            correctCount={calculateResults.correctCount}
            totalQuestions={quiz.questions.length}
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
                  isCorrect={calculateResults.correctAnswers.has(currentQuestionIndex)}
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
                        disabled={!allAnswered}
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
                    correctAnswers={calculateResults.correctAnswers}
                  />

                  {quizState === 'taking' && (
                    <div className="mt-6 pt-4 border-t border-border">
                      <p className="text-sm text-muted-foreground mb-3">
                        Passing score: {quiz.passingScore}%
                      </p>
                      <Button
                        onClick={handleSubmit}
                        disabled={!allAnswered}
                        className="w-full gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Submit Quiz
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
