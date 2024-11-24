import React from "react";
import Navbar from "../../components/discussions/Navbar";
import Tabs from "../../components/discussions/Tabs";
import PostList from "../../components/discussions/PostList"; 
import Tags from "../../components/discussions/Tags";

const Discuss = () => {
  return (
    <div>
      <Navbar />
      <div className="container mt-4">
        <Tabs />
        <div className="row">
          {/* PostList nằm bên trái */}
          <div className="col-lg-9">
            <PostList />
          </div>
          {/* Tags nằm bên phải */}
          <div className="col-lg-3">
            <Tags />
          </div>
        </div>
      </div>

      {/* CSS */}
      <style jsx>{`
        .container {
          margin-top: 20px;
        }

        .row {
          display: flex;
          flex-direction: row;
        }

        .col-lg-9 {
          flex: 0 0 75%;
          max-width: 75%;
          border-right: 1px solid #ddd;
          padding-right: 15px;
        }

        .col-lg-3 {
          flex: 0 0 25%;
          max-width: 25%;
          padding-left: 15px;
        }

        .container .row {
          gap: 15px; /* Tạo khoảng cách giữa các cột */
        }

        .col-lg-9,
        .col-lg-3 {
          background-color: #ffffff;
        }
      `}</style>
    </div>
  );
};

export default Discuss;
