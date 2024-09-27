import { createSlice } from "@reduxjs/toolkit";


export const userSlice = createSlice({
    initialState : {},
    name : 'user',
    reducers :{
        fetchUser : (state , action)=>{
            return action.payload
        },
        deleteUser  : (state) =>{
            return  {}
        }
    }
})

export const { fetchUser, deleteUser } = userSlice.actions;


export default userSlice.reducer;