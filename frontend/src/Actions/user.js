import axios from "axios";

export const loginUser = (email, password) => async (dispatch) => {
    try {
        dispatch({
            type: "LoginRequest",
        });
        const { data } = await axios.post("/api/v1/login",{email, password}, {
            headers: {
                "Content-Type": "application/json",
            },
        });

        dispatch({
            type: "LoginSuccess", 
            payload:data.user,
        })

    } catch (error) {
        dispatch({
            type: "LoginFailure",
            payload:error,
        })
    }
};

//Load User If user token is present in cookie
export const loadUser = () => async (dispatch) => {
    try {
        dispatch({
            type: "LoadRequest",
        });
        const { data } = await axios.get("/api/v1/me");

        dispatch({
            type: " LoadSuccess", 
            payload:data.user,
        })

    } catch (error) {
        dispatch({
            type: "LoadFailure",
            payload:error,
        })
    }
}

//Post of following 
export const getFollowingPosts = () => async (dispatch) => {
    try {
        dispatch({ type: "postOfFollingRequest" });

        const { data } = await axios.get("/api/v1/posts");
        
        dispatch({
            type: "postOfFollowingSuccess",
            payload: data.posts,
        });
        
    } catch (error) {
        dispatch({
            type: "postOfFollowingFailure",
            payload: error,
        })
    }
};

//get all users
export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: "allUsersRequest" });

        const { data } = await axios.get("/api/v1/users");
        
        dispatch({
            type: "allUsersSuccess",
            payload: data.users,
        });
        
    } catch (error) {
        dispatch({
            type: "allUsersFailure",
            payload:error,
        })
    }
};

//get All Posts
export const getMyPosts = () => async (dispatch) => {
    try {
        dispatch({ type: "myPostsRequest" });

        const { data } = await axios.get("/api/v1/my/posts");
        
        dispatch({
            type: "myPostsSuccess",
            payload: data.posts,
        });
        
    } catch (error) {
        dispatch({
            type: "myPostsFailure",
            payload: error,
        })
    }
};