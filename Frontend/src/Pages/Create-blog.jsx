import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    return (
        <div>
            <h1>Create Blog</h1>
            <form>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                />
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Enter content"
                />
                <button type="submit">Submit</button>
            </form>
        </div>
    );
}

export default CreateBlog;