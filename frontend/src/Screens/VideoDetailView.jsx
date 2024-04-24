import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { videoDetailView } from '../actions/videoActions';
import { postQuestion, postReply, listQuestions } from '../actions/questionAction';
import './videodetailview.css';

const VideoDetailView = () => {
  const { productId, videoId } = useParams();
  const dispatch = useDispatch();
  const [questionText, setQuestionText] = useState('');
  const [replyText, setReplyText] = useState('');
  const video = useSelector((state) => state.videoDetailViewReducer.video);
  const userInfo = useSelector((state) => state.userLogin.userInfo);
  const userId = JSON.parse(localStorage.getItem('userInfo')).token.id;
  const questionsState = useSelector((state) => state.listQuestionsReducer);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        dispatch(videoDetailView(productId, videoId));
      } catch (error) {
        console.error('Error fetching video details:', error);
      }
    };

    fetchVideoDetails();
  }, [dispatch, productId, videoId]);

  useEffect(() => {
    // Dispatch the listQuestions action separately
    dispatch(listQuestions(productId, videoId));
  }, [dispatch, productId, videoId]);

  const handleQuestionSubmit = async () => {
    await dispatch(postQuestion(productId, videoId, { question: questionText }));
    setQuestionText(''); // Clear the question text after submission
    dispatch(listQuestions(productId, videoId)); // Fetch the updated list of questions
  };

  const handleReplySubmit = async (questionId, replyText) => {
    await dispatch(postReply(productId, videoId, questionId, { reply: replyText }));
    setReplyText(''); // Clear the reply text after submission
    dispatch(listQuestions(productId, videoId)); // Fetch the updated list of questions
  };

  return (
    <div>
      <h1>Video Details</h1>
      {video ? (
        <div>
          <p>Title: {video.title}</p>
          <p>Description: {video.description}</p>
          <p>Product User: {video.product_user}</p>
          <video controls autoPlay >
            <source src={video.video_file} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      ) : null}

      {/* Conditionally render the submit question button */}
      {userId !== video?.product_user && (
        <div>
          <button onClick={handleQuestionSubmit}>Submit Question</button>
          <textarea
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            placeholder="Ask your question..."
          />
        </div>
      )}

      <h2>Questions</h2>
      {questionsState.error ? (
        <div>Error: {questionsState.error}</div>
      ) : (
        <div>
          {questionsState.questions.length === 0 ? (
            <p>No questions</p>
          ) : (
            questionsState.questions.map((question) => (
              <div key={question.id}>
                <p>User: {question.user_details.name}</p> {/* Display the user's name */}
                <p>{question.question}</p>
                {/* Adjusted the condition to hide reply textbox and button if user is not the creator */}
                {video && userId && video.product_user && userId === video.product_user ? (
                  <div>
                    {!question.reply && ( // Only render if there is no reply
                      <>
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Enter your reply..."
                        />
                        <button onClick={() => handleReplySubmit(question.id, replyText)}>
                          Submit Reply
                        </button>
                      </>
                    )}
                  </div>
                ) : null}
                {/* Display replies */}
                {question.reply && <p>Instructor's Reply: {question.reply}</p>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default VideoDetailView;