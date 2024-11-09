﻿
namespace BuildingBlocks.Exceptions;
public class ConflictException : Exception {
    public ConflictException() : base("A conflict occurred.") {
    }

    public ConflictException(string message) : base(message) {
    }
}

