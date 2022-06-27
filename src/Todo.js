import {
    Form,
    FormError,
    FormStrategy,
    FormControl,
    ValidateOption,
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
            label="Ddl"
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
function FormSpent() {
    const input = Form.useField("SpentT","");
    return (
        <FormControl
            label="已花费时间"
            name="SpentT"
        >
            <Input value={input.value} widthSize="xs" disabled />
        </FormControl>
    )
}
function FormSubtask(props) {
    console.log(props.child.current)
    // props.child.patchValue({title:"fuck you", done: false})
    // const onChangeVal = (value) => input.value.title = value
    // return (
    //     <FormControl
    //         label={title}
    //     >
    //         <Input
    //             value={input.value.title}
    //             onChange={onChangeVal}
    //         />
    //     </FormControl>
    // )
}
function FormSubtasks() {
    const model = Form.useFieldArray("Subtasks", [
        Validators.maxLength(20, '最多添加 20 项'),
    ]);
    const addSubtask = useCallback(() => {
        model.push({title:"", done:false});
        model.validate(ValidateOption.IncludeUntouched);
    }, []);
    return (
        <>
            <Button onClick={addSubtask} className="add-btn">
                添加子任务
            </Button>
            <ul>
                {model.children.map((child, index) =>
                {
                    return (
                    <li key={child.id} className="Subtask">
                        <FormSubtask
                            title={`子任务${index + 1}：`}
                            child={child}
                        />
                        <button
                            className="del-btn"
                            onClick={() => {
                                model.splice(index, 1);
                                model.validate();
                            }}
                        >
              删除该子任务
            </button>
                    </li>
                )})}
            </ul>
            <FormError style={{ marginLeft: 128 }}>{model.error?.message}</FormError>
        </>
    );
}
function TodoForm(props) {
    const form = Form.useForm(FormStrategy.View);
    utils.Fetch("/api/todo/get?id="+ props.id, "GET").then(res => {
        if (res.status !== 200) {
            res.json().then(res => Notify.error(res.Msg))
            closeDialog(props.title)
        } else {
            res.json().then(res => {
                form.initialize(res.Msg)
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
            <FormInputField
                name="EstimatedT"
                label="预计耗时"
            />
            <FormSpent />
            {/*<FormSubtasks />*/}
            <div className="zent-form-actions">
                <Button type="primary" onClick={() =>
                {
                    console.log(form.getValue())
                }
                }>
                    提交
                </Button>
            </div>
        </Form>
    );
}

function editButton(id, title) {
    return () => openDialog({
        dialogId: title,
        title: "Todo " + title,
        children: <>  <TodoForm id={id} title={title}/> </>,
        footer: (<> <Button onClick={() => closeDialog(title)}>关闭</Button> </>),
        style: {
            position:"absolute",
            width:"90%",
            left:"5%",
            top:"2%",
        }
    })
}

function TodoCard(props) {
    return (
        <Card><div>
            <Button onClick={editButton(props.id, props.title)}> 编辑 </Button>
            <Button onClick={deleteButton(props.id, props.title)}> 删除 </Button>
        </div> </Card>
    )
}

export default TodoCard