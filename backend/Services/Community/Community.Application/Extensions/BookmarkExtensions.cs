using Community.Application.Models.Bookmarks.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Community.Application.Extensions
{
    public static class BookmarkExtensions
    {
        public static BookmarkDto ToBookmarkDto(this Bookmark bookmark)
        {
            return new BookmarkDto(
                Id: bookmark.Id.Value,
                UserId: bookmark.UserId.Value,
                DiscussionId: bookmark.DiscussionId.Value,
                DateBookmarked: bookmark.DateBookmarked
            );
        }
    }
}
