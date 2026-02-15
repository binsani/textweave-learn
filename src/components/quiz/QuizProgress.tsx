import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
  answeredQuestions: Set<number>;
  onQuestionClick?: (index: number) => void;
  isReviewMode?: boolean;
  correctAnswers?: Set<number>;
}

export function QuizProgress({
  currentQuestion,
  totalQuestions,
  answeredQuestions,
  onQuestionClick,
  isReviewMode = false,
  correctAnswers = new Set(),
}: QuizProgressProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {answeredQuestions.size} of {totalQuestions} answered
        </span>
        <span className="font-medium">
          {Math.round((answeredQuestions.size / totalQuestions) * 100)}%
        </span>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${(answeredQuestions.size / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question Indicators */}
      <div className="flex flex-wrap gap-2 pt-2">
        {Array.from({ length: totalQuestions }, (_, index) => {
          const isAnswered = answeredQuestions.has(index);
          const isCurrent = currentQuestion === index;
          const isCorrect = isReviewMode && correctAnswers.has(index);
          const isIncorrect = isReviewMode && isAnswered && !correctAnswers.has(index);

          return (
            <button
              key={index}
              onClick={() => onQuestionClick?.(index)}
              disabled={!onQuestionClick}
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                'border-2 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                isCurrent && !isReviewMode && 'border-primary bg-primary text-primary-foreground',
                !isCurrent && !isAnswered && 'border-border bg-background text-muted-foreground hover:border-primary/50',
                !isCurrent && isAnswered && !isReviewMode && 'border-primary/50 bg-primary/10 text-primary',
                isCorrect && 'border-success bg-success/10 text-success',
                isIncorrect && 'border-destructive bg-destructive/10 text-destructive',
                onQuestionClick && 'cursor-pointer'
              )}
            >
              {isReviewMode && isAnswered ? (
                isCorrect ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span>×</span>
                )
              ) : (
                index + 1
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
