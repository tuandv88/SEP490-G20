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
        // Phương thức mở rộng để chuyển đổi từ Bookmark sang BookmarkDto
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
