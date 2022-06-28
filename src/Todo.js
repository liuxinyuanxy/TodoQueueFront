import {
    Form,
    FormStrategy,
    FormControl,
    Input,
    Validators,
    Button,
    Card,
    Dialog,
    Notify,
    DatePicker,
    FormInputField,
    ValidateOption,
    FormError,
} from 'zent';
import React, {useCallback} from "react";
import 'zent/css/index.css';
import * as utils from "./utils";

const { openDialog, closeDialog } = Dialog;

function FormDate() {
    const input = Form.useField("Ddl", "");
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
    const input = Form.useField("SpentT", "");
    return (
        <FormControl
            label="已花费时间"
            name="SpentT"
        >
            <Input value={input.value} widthSize="xs" disabled />
        </FormControl>
    )
}
function FormSubtasks() {
    const model = Form.useFieldArray("Subtasks", [
        Validators.maxLength(20, '最多添加 20 项'),
    ]);
    const addSubtask = useCallback(() => {
        model.push("");
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
                        <FormInputField
                            model={child}
                            label={`子任务${index + 1}：`}
                            validators={[Validators.required('请填写子任务')]}
                            props={{
                                width: "30%",
                            }}
                            after={<Button
                                className="del-btn"
                                onClick={() => {
                                    model.splice(index, 1);
                                    model.validate();
                                }}
                            >
              删除该子任务
            </Button>}
                        />

                    </li>
                )})}
            </ul>
            <FormError style={{ marginLeft: 128 }}>{model.error?.message}</FormError>
        </>
    );
}
function TodoForm(props) {
    const form = Form.useForm(FormStrategy.View);
    const onSubmit = React.useCallback(form => {
        const value = form.getValue();
        console.log(value)
        utils.Fetch("/api/todo/change?id=" + props.id, "POST", JSON.stringify(value), "application/json").then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            } else {
                Notify.success("success")
                closeDialog(props.title)
            }
        })
    }, []);
    const onSubmitFail = () => {Notify.error("有字段为空，表单不合法！")}
    utils.Fetch("/api/todo/get?id=" + props.id, "GET").then(res => {
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
            onSubmit={onSubmit}
            onSubmitFail={onSubmitFail}
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
            <FormSubtasks />
            <div className="zent-form-actions">
                <Button type="primary" onClick={() => {form.submit()}}>
                    提交
                </Button>
            </div>
        </Form>
    );
}

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
function editButton(id, title) {
    return () => openDialog({
        dialogId: title,
        title: "Todo " + title,
        children: <>  <TodoForm id={id} title={title} /> </>,
        footer: (<> <Button onClick={() => closeDialog(title)}>关闭</Button> </>),
        style: {
            position: "absolute",
            width: "90%",
            left: "5%",
            top: "2%",
        }
    })
}

function TodoCard(props) {
    return (
        <Card><div>
            {props.title}
            <Button onClick={editButton(props.id, props.title)}> 编辑 </Button>
            <Button onClick={deleteButton(props.id, props.title)}> 删除 </Button>
        </div> </Card>
    )
}

// function newTodo() {
//     const form = Form.useForm(FormStrategy.View);
//     utils.Fetch("/api/todo/get?id=" + props.id, "GET").then(res => {
//         if (res.status !== 200) {
//             res.json().then(res => Notify.error(res.Msg))
//             closeDialog(props.title)
//         } else {
//             res.json().then(res => {
//                 form.initialize(res.Msg)
//             })
//         }
//     })
//     return (
//         <Form
//             form={form}
//             layout="horizontal"
//             scrollToError
//         >
//             <FormInputField
//                 name="Title"
//                 label="标题"
//                 validators={[Validators.required('请填写标题')]}
//             />
//             <FormDate />
//             <FormInputField
//                 name="EstimatedT"
//                 label="预计耗时"
//             />
//             <FormSpent />
//             <FormSubtasks />
//             <div className="zent-form-actions">
//                 <Button type="primary" onClick={() => {
//                     console.log(form.getValue())
//                 }
//                 }>
//                     提交
//                 </Button>
//             </div>
//         </Form>
//     );
// }

export default TodoCard