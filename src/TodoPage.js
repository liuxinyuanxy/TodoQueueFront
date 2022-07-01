import TodoList from "./List"
import { NewTodo } from "./Todo"
import React from "react";
import 'zent/css/index.css';
import { Button, Dialog, Affix } from "zent";
const { openDialog, closeDialog } = Dialog;
function NewTodoButton(props) {
    return (
        <Affix offsetTop={0}>
            <Button icon={'plus-circle-o'} onClick={() => openDialog({
                dialogId: "NewTodo",
                title: "新建Todo",
                children: <>  <NewTodo refresher={() => props.refresher()} /> </>,
                footer: (<> <Button onClick={() => closeDialog("NewTodo")}>关闭</Button> </>),
                style: {
                    "minWidth": "10px",
                }
            })} style={{
                width: "100%",
                background: "white",
            }}> </Button>
        </Affix>
    )
}

function TodoPage() {
    return (
        <div style={{
            margin: "10%",
            marginBottom: "22%",
        }}>
            <TodoList />
        </div>
    )
}

export { TodoPage, NewTodoButton }
