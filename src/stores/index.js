const todos = []
const state = { todos }

const getters = {
    todoById: (state) => (id) => {
        return state.todos.find(todo => todo.id === id)
    }
}

const mutations = {
    addTodo (state, {todo}) {
        state.todos.push(todo)
    },
    saveTodo (state, {todoId, name, description}) {
        var index = state.todos.findIndex(todo => todo.id == todoId)
        state.todos[index].name = name
        state.todos[index].description = description
        state.todos[index].editmode = false
    },
    cancelTodo(state, {todoId}) {
        var index = state.todos.findIndex(todo => todo.id === todoId)
        if(state.todos[index].name == "") {
            state.todos = state.todos.filter(todo => todo.id !== todoId)
        }
        else {
            state.todos[index].editmode = false;
        }
    },
    editTodo(state, {todoId}) {
        var index = state.todos.findIndex(todo => todo.id === todoId)
        state.todos[index].editmode = true
    },
    setTodoStatus (state, {todoId, status}) {
        var index = state.todos.findIndex(p => p.id == todoId)
        state.todos[index].status = status
    },
    deleteTodo(state, {todoId}) {
        state.todos = state.todos.filter((todo) => todo.id !== todoId)
    },
    insertTodo(state, {todos}) {
        state.todos = todos
    }
}

const actions = {
    addNewTodo ({commit}, todo) {
        return new Promise((resolve, reject) => {
            commit('addTodo', {todo})
            resolve()
        })
    },
    setTodoComplete ({commit}, todo) {
        return new Promise((resolve, reject) => {
            commit('setTodoStatus', {todoId: todo.id, status: 'completed'})
            resolve()
        })
    },
    discardTodo({commit}, todo) {
        return new Promise((resolve, reject) => {
            commit('setTodoStatus', {todoId: todo.id, status: 'discarded'})
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}