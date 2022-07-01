import {
    Form,
    FormStrategy,
    // FormControl,
    // Input,
    Validators,
    Button,
    Card,
    Dialog,
    Notify,
    // DatePicker,
    FormInputField,
    FormNumberInputField,
    ValidateOption,
    FormError,
} from 'zent';
import React, { useCallback } from "react";
import { NewTodo } from "./Todo";
import * as utils from "./utils";

let refresher
const { openDialog, closeDialog } = Dialog;

function CloseDialog(title) {
    refresher()
    closeDialog(title)
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
                {model.children.map((child, index) => {
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
                    )
                })}
            </ul>
            <FormError style={{ marginLeft: 128 }}>{model.error?.message}</FormError>
        </>
    );
}
function TemplateForm(props) {
    let pressButton = 0
    const form = Form.useForm(FormStrategy.View);
    const onSubmit = React.useCallback(form => {
        const value = form.getSubmitValue()

        utils.Fetch("/api/template/change?tid=" + props.id, "POST", JSON.stringify(value), "application/json").then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            } else {
                if (pressButton === 2) {
                    CloseDialog(props.title)
                    Notify.success("success");
                } else {
                    CloseDialog(props.title)
                    openDialog({
                        dialogId: "NewTodo",
                        title: "从模板新建Todo",
                        children: <>  <NewTodo id={props.id} /> </>,
                        footer: (<> <Button onClick={() => closeDialog("NewTodo")}>关闭</Button> </>),
                        style: {
                            "minWidth": "10px",
                        }
                    })
                }
            }
        })
    }, []);
    const onSubmitFail = () => { Notify.error("有字段为空，表单不合法！") }
    utils.Fetch("/api/template/get?tid=" + props.id, "GET").then(res => {
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
            <FormNumberInputField
                name="Priority"
                label="优先级："
                defaultValue={4}
                normalizeBeforeSubmit={value => Number(value)}
                props={{
                    showStepper: true,
                    min: 1,
                    max: 4,
                }}
            />
            <FormNumberInputField
                name="EstimatedT"
                label="预计耗时"
                normalizeBeforeSubmit={value => Number(value)}
                props={{
                    showStepper: true,
                    min: 0,
                }}
            />
            <FormSubtasks />
            <div className="zent-form-actions">
                <Button
                    style={{
                        background: "rgba(187,222,214,0.76)",
                    }} onClick={() => { pressButton = 1; form.submit() }}>
                    从此模板新建Todo
                </Button>
                <Button onClick={() => { pressButton = 2; form.submit() }}>
                    确认修改
                </Button>
            </div>
        </Form>
    );
}

function deleteTemplate(id, title) {
    utils.Fetch("/api/template/delete?tid=" + id, "POST").then(res => {
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
            children: <div> 您是否要删除Template: {title} </div>,
            footer: (
                <>
                    <Button
                        style={{
                            background: "rgba(187,222,214,0.76)",
                        }} onClick={() => CloseDialog(title)}> 取消 </Button>
                    <Button onClick={() => {
                        deleteTemplate(id, title)
                    }}>
                        确定
                    </Button>
                </>
            ),
            style: {
                "minWidth": "10px",
            }
        }
    )
}
function viewButton(id, title) {
    return () => openDialog({
        dialogId: title,
        title: "Template " + title,
        children: <>  <TemplateForm id={id} title={title} /> </>,
        footer: (<> <Button onClick={() => CloseDialog(title)}>关闭</Button> </>),
        style: {
            "minWidth": "10px",
        }
    })
}

function NewTemplate(props) {
    refresher = props.refresher
    const form = Form.useForm(FormStrategy.View);
    const onSubmit = React.useCallback(form => {
        const value = form.getSubmitValue()

        utils.Fetch("/api/template/add", "POST", JSON.stringify(value), "application/json").then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            } else {
                Notify.success("success")
                CloseDialog("NewTemplate")
            }
        })
    }, []);
    const onSubmitFail = () => { Notify.error("有字段为空，表单不合法！") }

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
            <FormNumberInputField
                name="Priority"
                label="优先级："
                defaultValue={4}
                normalizeBeforeSubmit={value => Number(value)}
                props={{
                    showStepper: true,
                    min: 1,
                    max: 4,
                }}
            />
            <FormNumberInputField
                name="EstimatedT"
                label="预计耗时"
                normalizeBeforeSubmit={value => Number(value)}
                props={{
                    showStepper: true,
                    min: 0,
                }}
            />
            <FormSubtasks />
            <div className="zent-form-actions">
                <Button
                    style={{
                        background: "rgba(187,222,214,0.76)",
                    }} onClick={() => { form.submit() }}>
                    提交
                </Button>
            </div>
        </Form>
    );
}
function TemplateCard(props) {
    refresher = props.refresher
    return (
        <Card><div>
            {props.title}
            <Button className={"inCardButton2"} onClick={viewButton(props.id, props.title)}> 查看 </Button>
            <Button className={"inCardButton1"} onClick={deleteButton(props.id, props.title)}> 删除 </Button>
        </div> </Card>
    )
}

export { NewTemplate, TemplateCard }