import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { Quiz, Question, QuestionType } from '@/types';

interface QuizEditorProps {
  quiz: Quiz | null;
  lessonId: string;
  lessonTitle: string;
  onSave: (quiz: Quiz) => void;
  onBack: () => void;
}

const emptyQuestion: Omit<Question, 'id' | 'quizId' | 'order'> = {
  type: 'multiple_choice',
  question: '',
  options: ['', '', '', ''],
  correctAnswer: '0',
  explanation: '',
  points: 10,
};

export function QuizEditor({ quiz, lessonId, lessonTitle, onSave, onBack }: QuizEditorProps) {
  const [editedQuiz, setEditedQuiz] = useState<Quiz>(
    quiz || {
      id: `quiz-${Date.now()}`,
      lessonId,
      title: `${lessonTitle} Quiz`,
      description: '',
      questions: [],
      passingScore: 70,
    }
  );
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);
  const [deleteQuestionIndex, setDeleteQuestionIndex] = useState<number | null>(null);

  const addQuestion = () => {
    const newQuestion: Question = {
      ...emptyQuestion,
      id: `question-${Date.now()}`,
      quizId: editedQuiz.id,
      order: editedQuiz.questions.length + 1,
    };
    setEditedQuiz({
      ...editedQuiz,
      questions: [...editedQuiz.questions, newQuestion],
    });
    setEditingQuestionIndex(editedQuiz.questions.length);
  };

  const updateQuestion = (index: number, updates: Partial<Question>) => {
    const newQuestions = [...editedQuiz.questions];
    newQuestions[index] = { ...newQuestions[index], ...updates };
    setEditedQuiz({ ...editedQuiz, questions: newQuestions });
  };

  const deleteQuestion = (index: number) => {
    setEditedQuiz({
      ...editedQuiz,
      questions: editedQuiz.questions.filter((_, i) => i !== index),
    });
    setDeleteQuestionIndex(null);
    if (editingQuestionIndex === index) {
      setEditingQuestionIndex(null);
    }
  };

  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const question = editedQuiz.questions[questionIndex];
    if (!question.options) return;
    const newOptions = [...question.options];
    newOptions[optionIndex] = value;
    updateQuestion(questionIndex, { options: newOptions });
  };

  const handleSave = () => {
    onSave(editedQuiz);
  };

  const currentQuestion = editingQuestionIndex !== null ? editedQuiz.questions[editingQuestionIndex] : null;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-xl font-serif font-bold">Quiz Editor</h2>
            <p className="text-sm text-muted-foreground">For: {lessonTitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Quiz
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Quiz Settings & Questions List */}
        <div className="space-y-6">
          {/* Quiz Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-serif">Quiz Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Quiz Title</Label>
                <Input
                  value={editedQuiz.title}
                  onChange={(e) => setEditedQuiz({ ...editedQuiz, title: e.target.value })}
                  placeholder="Enter quiz title..."
                />
              </div>
              <div className="space-y-2">
                <Label>Description (Optional)</Label>
                <Textarea
                  value={editedQuiz.description || ''}
                  onChange={(e) => setEditedQuiz({ ...editedQuiz, description: e.target.value })}
                  placeholder="Brief description of the quiz..."
                  className="resize-none h-20"
                />
              </div>
              <div className="space-y-2">
                <Label>Passing Score (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={editedQuiz.passingScore}
                  onChange={(e) =>
                    setEditedQuiz({ ...editedQuiz, passingScore: parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Time Limit (Optional)</Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={!!editedQuiz.timeLimit}
                    onCheckedChange={(checked) =>
                      setEditedQuiz({ ...editedQuiz, timeLimit: checked ? 10 : undefined })
                    }
                  />
                  {editedQuiz.timeLimit && (
                    <Input
                      type="number"
                      min="1"
                      value={editedQuiz.timeLimit}
                      onChange={(e) =>
                        setEditedQuiz({ ...editedQuiz, timeLimit: parseInt(e.target.value) || 1 })
                      }
                      className="w-20"
                    />
                  )}
                  <span className="text-sm text-muted-foreground">minutes</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions List */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-serif">Questions</CardTitle>
              <Button size="sm" onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </CardHeader>
            <CardContent>
              {editedQuiz.questions.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                  <p className="text-sm text-muted-foreground mb-3">No questions yet</p>
                  <Button variant="secondary" size="sm" onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Question
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {editedQuiz.questions.map((q, i) => (
                    <div
                      key={q.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        editingQuestionIndex === i
                          ? 'bg-primary/10 border border-primary/20'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setEditingQuestionIndex(i)}
                    >
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {i + 1}. {q.question || 'Untitled Question'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {q.type === 'multiple_choice'
                            ? 'Multiple Choice'
                            : q.type === 'true_false'
                            ? 'True/False'
                            : 'Short Answer'}{' '}
                          • {q.points} pts
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteQuestionIndex(i);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Question Editor */}
        <div className="lg:col-span-2">
          {currentQuestion ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-serif">
                  Question {editingQuestionIndex! + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Type */}
                <div className="space-y-2">
                  <Label>Question Type</Label>
                  <Select
                    value={currentQuestion.type}
                    onValueChange={(value: QuestionType) =>
                      updateQuestion(editingQuestionIndex!, {
                        type: value,
                        options: value === 'multiple_choice' ? ['', '', '', ''] : undefined,
                        correctAnswer: value === 'true_false' ? 'true' : value === 'multiple_choice' ? '0' : '',
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                      <SelectItem value="true_false">True / False</SelectItem>
                      <SelectItem value="short_answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Question Text */}
                <div className="space-y-2">
                  <Label>Question</Label>
                  <Textarea
                    value={currentQuestion.question}
                    onChange={(e) =>
                      updateQuestion(editingQuestionIndex!, { question: e.target.value })
                    }
                    placeholder="Enter your question..."
                    className="resize-none"
                  />
                </div>

                {/* Answer Options */}
                {currentQuestion.type === 'multiple_choice' && currentQuestion.options && (
                  <div className="space-y-3">
                    <Label>Answer Options</Label>
                    <RadioGroup
                      value={currentQuestion.correctAnswer as string}
                      onValueChange={(value) =>
                        updateQuestion(editingQuestionIndex!, { correctAnswer: value })
                      }
                    >
                      {currentQuestion.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-3">
                          <RadioGroupItem value={optIndex.toString()} id={`opt-${optIndex}`} />
                          <Input
                            value={option}
                            onChange={(e) =>
                              updateOption(editingQuestionIndex!, optIndex, e.target.value)
                            }
                            placeholder={`Option ${optIndex + 1}`}
                            className="flex-1"
                          />
                          {currentQuestion.correctAnswer === optIndex.toString() ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-muted-foreground/30" />
                          )}
                        </div>
                      ))}
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Select the radio button next to the correct answer
                    </p>
                  </div>
                )}

                {currentQuestion.type === 'true_false' && (
                  <div className="space-y-3">
                    <Label>Correct Answer</Label>
                    <RadioGroup
                      value={currentQuestion.correctAnswer as string}
                      onValueChange={(value) =>
                        updateQuestion(editingQuestionIndex!, { correctAnswer: value })
                      }
                      className="flex gap-4"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="true" id="true" />
                        <Label htmlFor="true" className="font-normal cursor-pointer">
                          True
                        </Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="false" id="false" />
                        <Label htmlFor="false" className="font-normal cursor-pointer">
                          False
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {currentQuestion.type === 'short_answer' && (
                  <div className="space-y-2">
                    <Label>Correct Answer</Label>
                    <Input
                      value={currentQuestion.correctAnswer as string}
                      onChange={(e) =>
                        updateQuestion(editingQuestionIndex!, { correctAnswer: e.target.value })
                      }
                      placeholder="Enter the correct answer..."
                    />
                    <p className="text-xs text-muted-foreground">
                      Student's answer must match exactly (case-insensitive)
                    </p>
                  </div>
                )}

                {/* Explanation */}
                <div className="space-y-2">
                  <Label>Explanation (Optional)</Label>
                  <Textarea
                    value={currentQuestion.explanation || ''}
                    onChange={(e) =>
                      updateQuestion(editingQuestionIndex!, { explanation: e.target.value })
                    }
                    placeholder="Explain why this is the correct answer..."
                    className="resize-none h-20"
                  />
                </div>

                {/* Points */}
                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    value={currentQuestion.points}
                    onChange={(e) =>
                      updateQuestion(editingQuestionIndex!, { points: parseInt(e.target.value) || 1 })
                    }
                    className="w-24"
                  />
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-full flex items-center justify-center">
              <CardContent className="text-center py-20">
                <p className="text-muted-foreground mb-4">
                  {editedQuiz.questions.length === 0
                    ? 'Add your first question to get started'
                    : 'Select a question from the list to edit'}
                </p>
                {editedQuiz.questions.length === 0 && (
                  <Button onClick={addQuestion}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Question
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Question Dialog */}
      <Dialog open={deleteQuestionIndex !== null} onOpenChange={() => setDeleteQuestionIndex(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Question?</DialogTitle>
            <DialogDescription>
              This will permanently delete this question. This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteQuestionIndex(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteQuestionIndex !== null && deleteQuestion(deleteQuestionIndex)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
