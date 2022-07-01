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
    FormInputField,
    FormNumberInputField,
    ValidateOption,
    FormError,
} from 'zent';
import React, {useCallback} from "react";
import * as utils from "./utils";

let refresher
const { openDialog, closeDialog } = Dialog;

function CloseDialog(title) {
    refresher()
    closeDialog(title)
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
function DoneForm(props) {
    let pressButton = 0
    const form = Form.useForm(FormStrategy.View);
    utils.Fetch("/api/todo/get/done?id=" + props.id, "GET").then(res => {
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
            disabled
        >
            <FormInputField
                name="Title"
                label="标题"
            />
            <FormNumberInputField
                name="EstimatedT"
                label="预计耗时"
            />
            <FormSpent />
            <FormSubtasks />
            <div className="zent-form-actions">
            </div>
        </Form>
    );
}

function deleteDone(id, title) {
    utils.Fetch("/api/todo/delete/done?id=" + id, "POST").then(res => {
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
            children: <div> 您是否要删除已完成: {title} </div>,
            footer: (
                <>
                    <Button
style={{
                            background:"rgba(187,222,214,0.76)",
                        }} onClick={() => CloseDialog(title)}> 取消 </Button>
                    <Button onClick={() => {
                        deleteDone(id, title)
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
function viewButton(id, title) {
    return () => openDialog({
        dialogId: title,
        title: "已完成 " + title,
        children: <>  <DoneForm id={id} title={title} /> </>,
        footer: (<> <Button onClick={() => CloseDialog(title)}>关闭</Button> </>),
        style: {
            "min-width":"10px",
        }
    })
}

function DoneCard(props) {
    refresher = props.refresher
    return (
        <Card style={{
            background: "rgba(218,234,241,0.85)",
        }}><div>
            {props.title}
            <Button  className={"inCardButton2"} onClick={viewButton(props.id, props.title)}> 查看 </Button>
            <Button className={"inCardButton1"} onClick={deleteButton(props.id, props.title)}> 删除 </Button>
        </div> </Card>
    )
}

export default DoneCard