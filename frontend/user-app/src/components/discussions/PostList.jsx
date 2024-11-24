import React from "react";
import { Link } from "react-router-dom";
import { AUTHENTICATION_ROUTERS } from '../../data/constants';

function PostList() {
  const posts = [
    {
      id: 1,
      title: "Google Online Assessment Questions",
      tags: ["google", "online assessment"],
      created: "August 6, 2019",
      views: "813.3K",
      votes: 2900,
    },
    {
      id: 2,
      title: "How to write an Interview Question post",
      tags: ["google"],
      created: "April 28, 2018",
      views: "176.4K",
      votes: 628,
    },
    // thêm các bài viết khác
  ];

  return (
    <div className="mt-3">
      {posts.map((post) => (
        <div key={post.id} className="card mb-3 post-card">
          <div className="card-body">
            <h5 className="card-title">
              <Link to={AUTHENTICATION_ROUTERS.DISCUSSIONDETAIL} className="text-decoration-none text-dark">
                {post.title}
              </Link>
            </h5>
            <p>
              {post.tags.map((tag, idx) => (
                <span key={idx} className="badge bg-secondary me-2">
                  {tag}
                </span>
              ))}
            </p>
            <small className="text-muted">Created at: {post.created}</small>
            <span className="float-end">
              👁️ {post.views} | ⬆️ {post.votes}
            </span>
          </div>
        </div>
      ))}

      {/* CSS */}
      <style jsx>{`
        .post-card {
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .post-card:hover {
          transform: translateY(-4px);
          box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15);
        }

        .card-title {
          font-weight: bold;
          font-size: 1.2rem;
        }

        .badge {
          background-color: #f0f0f0;
          color: #333;
          font-weight: 500;
        }

        .badge:hover {
          background-color: #ddd;
        }

        .float-end {
          font-size: 0.9rem;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}

export default PostList;
