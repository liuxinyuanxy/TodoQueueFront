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
    FormNumberInputField,
    ValidateOption,
    FormError,
} from 'zent';
import React, {useCallback} from "react";
import 'zent/css/index.css';
import * as utils from "./utils";
let refresher
const { openDialog, closeDialog } = Dialog;

function CloseDialog(title) {
    refresher()
    closeDialog(title)
}

function FormDate() {
    const input = Form.useField("Ddl", "");
    const onChangeDate = (value) => input.value = value
    return (
        <FormControl
            label="DDL"
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
            label="已花费时间(min)"
            name="SpentT"
        >
            <Input value={parseInt(input.value / 60)} widthSize="xs" disabled />
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
        const value = form.getSubmitValue()
        Notify.info("正在提交，请稍候")
        utils.Fetch("/api/todo/change?id=" + props.id, "POST", JSON.stringify(value), "application/json").then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            } else {
                Notify.success("success")
                refresher()
                CloseDialog(props.title)
            }
        })
    }, []);
    const onSubmitFail = () => {Notify.error("有字段为空，表单不合法！")}
    utils.Fetch("/api/todo/get?id=" + props.id, "GET").then(res => {
        if (res.status !== 200) {
            res.json().then(res => Notify.error(res.Msg))
            CloseDialog(props.title)
        } else {
            res.json().then(res => {
                form.initialize(res.Msg)
            })
        }
    })
    return (
        <Form
            form={form}
            layout="vertical"
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
            <FormNumberInputField
                name="EstimatedT"
                label="预计耗时(min)"
                normalizeBeforeSubmit={value => Number(value)}
            />
            <FormSpent />
            <FormSubtasks />
            <div className="zent-form-actions">
                <Button 
 style={{
                            background:"rgba(187,222,214,0.76)",
                        }}  onClick={() => {form.submit()}}>
                    提交
                </Button>
            </div>
        </Form>
    );
}

function deleteTodo(id, title) {
    utils.Fetch("/api/todo/delete?id=" + id, "POST").then(res => {
        if (res.status !== 200) {
            res.json().then(res => Notify.error(res.Msg))
        } else {
            res.json().then(res => Notify.success(res.Msg))
        }
        CloseDialog(title)
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
                    <Button 
 style={{
                            background:"rgba(187,222,214,0.76)",
                        }}  onClick={() => CloseDialog(title)}> 取消 </Button>
                    <Button onClick={() => {
                        deleteTodo(id, title)
                    }}>
                        确定
                    </Button>
                </>
            ),
            style: {
                "min-width":"10px",
            }
        }
    )
}
function editButton(id, title) {
    return () => openDialog({
        dialogId: title,
        title: "Todo " + title,
        children: <>  <TodoForm id={id} title={title} /> </>,
        footer: (<> <Button onClick={() => CloseDialog(title)}>关闭</Button> </>),
        style: {
            "min-width":"10px",
        }
    })
}

function TodoCard(props) {
    refresher = props.refresher
    return (
        <Card style={{
            background:props.color,
        }}><div>
            {props.title}
            <Button className={"inCardButton2"} onClick={editButton(props.id, props.title)}> 编辑 </Button>
            <Button className={"inCardButton1"} onClick={deleteButton(props.id, props.title)}> 删除 </Button>
        </div> </Card>
    )
}

function NewTodo(props) {
    const form = Form.useForm(FormStrategy.View);
    const onSubmit = React.useCallback(form => {
        const value = form.getSubmitValue();
        
        utils.Fetch("/api/todo/new", "POST", JSON.stringify(value), "application/json").then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            } else {
                Notify.success("success")
                if (props.refresher !== undefined)
                    props.refresher()
                closeDialog("NewTodo")
            }
        })
    }, []);
    const onSubmitFail = () => {Notify.error("有字段为空，表单不合法！")}
    if (props.id !== undefined)
    {
        utils.Fetch("/api/template/get?tid=" + props.id, "GET").then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
                closeDialog("NewTodo")
            } else {
                res.json().then(res => {
                    form.initialize(res.Msg)
                })
            }
        })
    }
    return (
        <Form
            form={form}
            layout="vertical"
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
            <FormNumberInputField
                name="Priority"
                label="优先级："
                defaultValue={4}
                normalizeBeforeSubmit={value => Number(value)}
                props={{
                    showStepper: true,
                    min:1,
                    max:4,
                }}
            />
            <FormNumberInputField
                name="EstimatedT"
                label="预计耗时(min)"
                normalizeBeforeSubmit={value => Number(value)}
                props={{
                    showStepper: true,
                    min:0,
                }}
            />
            <FormSubtasks />
            <div className="zent-form-actions">
                <Button 
 style={{
                            background:"rgba(187,222,214,0.76)",
                        }}  onClick={() => {form.submit()}}>
                    提交
                </Button>
            </div>
        </Form>
    );
}

export {NewTodo, TodoCard}