import { useState } from 'react';
import { Question } from '@/types';
import { cn } from '@/lib/utils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle, HelpCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedAnswer: string | null;
  onAnswerSelect: (answerId: string) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

export function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedAnswer,
  onAnswerSelect,
  showResult = false,
  isCorrect,
}: QuizQuestionProps) {
  const getOptionStyles = (index: number) => {
    if (!showResult) {
      return selectedAnswer === String(index)
        ? 'border-primary bg-primary/5'
        : 'border-border hover:border-primary/50 hover:bg-muted/50';
    }

    const isSelected = selectedAnswer === String(index);
    const isCorrectAnswer = question.correctAnswer === String(index);

    if (isCorrectAnswer) {
      return 'border-success bg-success/10';
    }
    if (isSelected && !isCorrectAnswer) {
      return 'border-destructive bg-destructive/10';
    }
    return 'border-border opacity-60';
  };

  const getOptionIcon = (index: number) => {
    if (!showResult) return null;

    const isCorrectAnswer = question.correctAnswer === String(index);
    const isSelected = selectedAnswer === String(index);

    if (isCorrectAnswer) {
      return <CheckCircle2 className="h-5 w-5 text-success shrink-0" />;
    }
    if (isSelected && !isCorrectAnswer) {
      return <XCircle className="h-5 w-5 text-destructive shrink-0" />;
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>Question {questionNumber} of {totalQuestions}</span>
          <span>•</span>
          <span>{question.points} points</span>
          {question.type === 'true_false' && (
            <>
              <span>•</span>
              <span className="text-xs bg-muted px-2 py-0.5 rounded">True/False</span>
            </>
          )}
        </div>
        <h3 className="text-xl font-medium font-serif leading-relaxed">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <RadioGroup
        value={selectedAnswer || ''}
        onValueChange={onAnswerSelect}
        disabled={showResult}
        className="space-y-3"
      >
        {question.options?.map((option, index) => (
          <Label
            key={index}
            htmlFor={`option-${index}`}
            className={cn(
              'flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
              getOptionStyles(index),
              showResult && 'cursor-default'
            )}
          >
            <RadioGroupItem
              value={String(index)}
              id={`option-${index}`}
              className="shrink-0"
            />
            <span className="flex-1 text-base">{option}</span>
            {getOptionIcon(index)}
          </Label>
        ))}
      </RadioGroup>

      {/* Explanation (shown after answering) */}
      {showResult && question.explanation && (
        <div className="flex gap-3 p-4 bg-muted/50 rounded-lg border border-border">
          <HelpCircle className="h-5 w-5 text-info shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium mb-1">Explanation</p>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
          </div>
        </div>
      )}
    </div>
  );
}
