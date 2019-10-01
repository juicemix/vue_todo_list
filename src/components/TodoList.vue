<template lang="pug">
    section
        b-message(v-if="todos.length < 1" title="Info" type="is-info" aria-close-label="Close message")
            | No ToDos!
        div(v-else)
            b-collapse.card(v-for="todo in todos" aria-id="contentIdForA11y3")
                div(v-if="todo.status == 'pending'" slot="trigger" slot-scope="props" role="button" aria-controls="contentIdForA11y3" style="background-color: Blue;").card-header
                    p.card-header-title
                        label(v-if="todo.editmode && todo.name == ''")
                            | New *
                        label(v-else-if="todo.editmode")
                            | Edit *
                        label(v-else)
                            | {{todo.name}}
                    a.card-header-icon
                        b-icon(:icon="props.open?'menu-down':'menu-up'")
                div(v-else slot="trigger" slot-scope="props" role="button" aria-controls="contentIdForA11y3" style="background-color: Green;").card-header
                    p.card-header-title
                        label(v-if="todo.editmode")
                            | Edit *
                        label(v-else)
                            | {{todo.name}}
                    a.card-header-icon
                        b-icon(:icon="props.open?'menu-down':'menu-up'")
                .card-content
                    div(v-if="todo.editmode").content
                        b-field(label="Activity Name")
                            b-input(v-model="nameInput")
                        b-field(label="Description")
                            b-input(v-model="descInput" maxlength="500" type="textarea")
                    div(v-else).content
                        | {{todo.description}}
                footer.card-footer
                    a(v-if="todo.editmode" v-on:click.self="save(todo.id)").card-footer-item
                        | Save
                    a(v-if="todo.editmode" v-on:click="cancel(todo.id)").card-footer-item
                        | Cancel
                    a(v-if="!todo.editmode && todo.status == 'pending'" v-on:click="setStatus(todo.id, 'done')").card-footer-item
                        | Done
                    a(v-if="!todo.editmode && todo.status == 'pending'" v-on:click="edit(todo.id)").card-footer-item
                        | Edit
                    a(v-if="!todo.editmode" v-on:click="del(todo.id)").card-footer-item
                        | Delete
        br
        b-button(@click="add" type="is-primary")
            | Add
        | &nbsp;
        b-button(@click="exportToCsv" type="is-primary")
            | Export to CSV
</template>

<script>
import {uuid} from 'vue-uuid'
import {downloadCSV} from 'vue-json-csv'
import Papa from 'papaparse'

export default {
    data: function() {
        return {
            nameInput: "",
            descInput: "",
            todos: [],
            fields: ['id', 'title', 'name', 'status']
        }
    },
    mounted: function () {
        if(localStorage.getItem('todos')) {
            try {
                this.todos = JSON.parse(localStorage.getItem('todos'))
                this.$store.commit('insertTodo', this.todos)
            }
            catch(e){
                localStorage.removeItem('todos')

            }
        }
    },
    components: {
        downloadCSV
    },
    computed: {
        csvData: function() {
            return this.todos.map(item => ({
                ...item
            }))
        }
    },
    methods: {
        add: function() {
            const todo = {
                id: uuid.v1(),
                name: "",
                description: "",
                status: "pending",
                editmode: true
            }
            this.isEdit = true
            //this.$store.dispatch('addNewTodo', todo)
            this.todos.push(todo)
            this.saveToLocal()
        },
        save: function(id) {
            //this.$store.commit('saveTodo', {todoId: id, name: this.nameInput, description: this.descInput})
            var index = this.todos.findIndex(todo => todo.id == id)
            this.todos[index].name = this.nameInput
            this.todos[index].description = this.descInput
            this.todos[index].editmode = false
            this.inputCleanup()
            this.saveToLocal()
        },
        cancel: function(id) {
            //this.$store.commit('cancelTodo', {todoId: id})
            var index = this.todos.findIndex(todo => todo.id === id)
            if(this.todos[index].name == "") {
                this.todos = this.todos.filter(todo => todo.id !== id)
            }
            else {
                this.todos[index].editmode = false;
            }
            this.inputCleanup()
            this.saveToLocal()
        },
        edit: function(id) {
            var index = this.todos.findIndex(p => p.id == id)
            this.nameInput = this.todos[index].name
            this.descInput = this.todos[index].description
            //this.$store.commit('editTodo', {todoId: id})
            var index = this.todos.findIndex(todo => todo.id === id)
            this.todos[index].editmode = true
            this.saveToLocal()
        },
        del: function(id) {
            //this.$store.commit('deleteTodo', {todoId: id})
            this.todos = this.todos.filter((todo) => todo.id !== id)
            this.saveToLocal()
        },
        setStatus: function(id, status) {
            //this.$store.commit('setTodoStatus', {todoId: id, status: status})
            var index = this.todos.findIndex(p => p.id == id)
            this.todos[index].status = status
            this.saveToLocal()
        },
        inputCleanup: function() {
            this.nameInput = ""
            this.descInput = ""
        },
        saveToLocal: function() {
            const parsed = JSON.stringify(this.todos)
            localStorage.setItem('todos', parsed)
            this.$store.commit('insertTodo', this.todos)
        },
        exportToCsv: function() {
            var csv = Papa.unparse(this.todos)
            var csvData = new Blob([csv], {type:'text/csv;charset=utf-8;'})
            var csvURL = null
            if(navigator.msSaveBlob) {
                csvURL = navigator.msSaveBlob(csvData, 'todos.csv')
            } else {
                csvURL = window.URL.createObjectURL(csvData)
            }
            var tempLink = document.createElement('a')
            tempLink.href = csvURL
            tempLink.setAttribute('download', 'todos.csv')
            tempLink.click()
        }
    }
}
</script>