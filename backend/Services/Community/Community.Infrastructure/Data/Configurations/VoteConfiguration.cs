﻿using Community.Domain.Models;
using Community.Domain.Enums;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Community.Infrastructure.Data.Configurations
{
    public class VoteConfiguration : IEntityTypeConfiguration<Vote>
    {
        public void Configure(EntityTypeBuilder<Vote> builder)
        {
            // Định nghĩa khóa chính
            builder.HasKey(v => v.Id);

            builder.Property(v => v.Id)
                .HasConversion(
                    voteId => voteId.Value,
                    dbId => VoteId.Of(dbId));

            // Thiết lập UserId với Value Converter
            builder.Property(v => v.UserId)
                .HasConversion(
                    userId => userId.Value,
                    dbUserId => new UserId(dbUserId))
                .IsRequired();

            // Cấu hình VoteType (enum)
            builder.Property(v => v.VoteType)
                .IsRequired()
                .HasConversion(
                    v => v.ToString(),
                    v => (VoteType)Enum.Parse(typeof(VoteType), v));

            builder.Property(v => v.DateVoted)
                .IsRequired();

            builder.Property(v => v.IsActive)
                .HasDefaultValue(true);

            // Thiết lập các chỉ mục
            builder.HasIndex(v => v.UserId);
            builder.HasIndex(v => v.DiscussionId);
            builder.HasIndex(v => v.CommentId);
        }
    }
}
