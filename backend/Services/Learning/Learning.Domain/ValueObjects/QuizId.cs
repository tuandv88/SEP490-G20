﻿namespace Learning.Domain.ValueObjects;
public record QuizId {
    public QuizId(Guid value) => Value = value;
    public Guid Value { get; }
    public static QuizId Of(Guid value) {
        ArgumentNullException.ThrowIfNull(value);
        if (value == Guid.Empty) {
            throw new DomainException("QuizId cannot be empty.");
        }
        return new QuizId(value);
    }
}

