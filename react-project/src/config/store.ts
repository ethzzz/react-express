import { createSlice, configureStore} from '@reduxjs/toolkit'

const counterSlice = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {
        increment: (state) => state + 1,
        decrement: (state) => state - 1
    }
})

export const { increment, decrement } = counterSlice.actions

const store = configureStore({
    reducer: counterSlice.reducer
})

export default store