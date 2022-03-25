import { createAction, createSlice, nanoid } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";
import { getCurrentUserId } from "./users";

const commentsSlice = createSlice({
    name: "commets",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFiled: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commentCreated: (state, action) => {
            state.entities.push(action.payload);
        },
        commentRemove: (state, action) => {
            state.entities = state.entities.filter((elem) => elem._id !== action.payload);
        }
    }
});

const commentCreateFiled = createAction("/comments/commentCreateFiled");
const commentCreateRequested = createAction("/comments/commentCreateRequested");
const commentRemoveRequested = createAction("/comments/commentRemoveRequest");
const commentRemoveFiled = createAction("/comment/commentRemoveFiled");

const { reducer: commentsReducer, actions } = commentsSlice;
const {
    commentsRequested,
    commentsReceived,
    commentsRequestFiled,
    commentCreated,
    commentRemove
} = actions;

export const removeComment = (userId) => async (dispatch) => {
    console.log("data", userId);
    dispatch(commentRemoveRequested());
    try {
        const { content } = await commentService.removeComment(userId);
        console.log("cont", content);
        if (content === null) {
            dispatch(commentRemove(userId));
        }
    } catch (error) {
        dispatch(commentRemoveFiled(error.message));
    }
};

export const createComment = (payload) => async (dispatch, getState) => {
    dispatch(commentCreateRequested(payload));
    const comment = {
        ...payload,
        _id: nanoid(),
        created_at: Date.now(),
        userId: getCurrentUserId()(getState())
    };
    try {
        const { content } = await commentService.createComment(comment);
        dispatch(commentCreated(content));
    } catch (error) {
        dispatch(commentCreateFiled(error.message));
    }
};
export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFiled(error.message));
    }
};
export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) => state.comments.isLoading;

export default commentsReducer;
