import {
    Form,
    FormError,
    FormStrategy,
    FormControl,
    Input,
    Validators,
    useFormChild,
    Button,
    Card,
    Dialog,
    Notify,
    DatePicker,
    FormDatePickerField,
    FormCombinedDateRangePickerField,
    FormInputField,
} from 'zent';
import React, {Component, useCallback} from "react";
import 'zent/css/index.css';
import * as utils from "./utils";

const { openDialog, closeDialog } = Dialog;

function deleteTodo(id) {
    utils.Fetch("/api/todo/delete?id=" + id, "POST").then(res => {
        if (res.status !== 200) {
            res.json().then(res => Notify.error(res.Msg))
        } else {
            res.json().then(res => Notify.success(res.Msg))
        }
    })
}

function deleteButton(id, title) {
    return () => openDialog(
        {
            dialogId: title,
            title: "请注意",
            children: <div> 您是否要删除Todo: {title} </div>,
            footer: (
                <>
                    <Button type="primary" onClick={() => closeDialog(title)}> 取消 </Button>
                    <Button onClick={() => {
                        deleteTodo(id)
                        closeDialog(title)
                    }}>
                        确定
                    </Button>
                </>
            )
        }
    )
}


function FormDate() {
    const input = Form.useField("Ddl","");
    const onChangeDate = (value) => input.value = value
    return (
        <FormControl
            label="Ddl:"
            name="Ddl"
        >
            <DatePicker
                className="zent-datepicker-demo"
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                value={input.value}
                onChange={onChangeDate}
            />
        </FormControl>
    )
}
function TodoForm(props) {
    const form = Form.useForm(FormStrategy.View);
    utils.Fetch("/api/todo/get?id="+ props.id, "GET").then(res => {
        if (res.status !== 200) {
            res.json().then(res => Notify.error(res.Msg))
            closeDialog(props.title)
        } else {
            res.json().then(res => {
                console.log(form.getValue())
                form.initialize(res.Msg)
                console.log(form.getValue())
                console.log(res.Msg)
            })
        }
    })
    return (
        <Form
            form={form}
            layout="horizontal"
            scrollToError
        >
            <FormInputField
                name="Title"
                label="标题"
                validators={[Validators.required('请填写标题')]}
            />
            <FormDate />
            <div className="zent-form-actions">
                <Button type="primary" onClick={() =>
                {
                    console.log(form.getValue())
                //     utils.Fetch(`/api/user/login`, 'POST', utils.GenerateFormDataFromObject(form.getValue())).then(res => {
                //         if (res.status !== 200) {
                //             res.json().then(res => Notify.error(res.Msg))
                //         } else {
                //             closeDialog(props.title)
                //         }
                //     })
                }
                }>
                    登录
                </Button>
            </div>
        </Form>
    );
}

function editButton(id, title) {
    return () => openDialog({
        dialogId: title,
        title: "注册",
        children: <>  <TodoForm id={id} title={title}/> </>,
        footer: (<> <Button onClick={() => closeDialog(title)}>关闭</Button> </>)
    })
}

function TodoCard(props) {
    console.log(props)
    return (
        <Card><div>
            <Button onClick={editButton(props.id, props.title)}> 编辑 </Button>
            <Button onClick={deleteButton(props.id, props.title)}> 删除 </Button>
        </div> </Card>
    )
}

export default TodoCard