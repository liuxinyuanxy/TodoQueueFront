import {
    Form,
    FormStrategy,
    Button,
    Dialog,
    Notify,
    Validators,
    FormInputField,
} from 'zent';
import React, {useCallback} from "react";
import 'zent/css/index.css';
import * as utils from "./utils";
let refresher

const { openDialog, closeDialog } = Dialog;
const registerID = "register";
const loginID = "login";

function equalsPassword(value, ctx) {
    if (value !== ctx.getSectionValue('passwd').passwd) {
        return {
            name: 'passwordEqual',
            message: '两次填写的密码不一致',
        };
    }
    return null;
}

function RegisterForm() {
    const form = Form.useForm(FormStrategy.View);
    const resetForm = useCallback(() => {
        form.resetValue();
    }, [form]);
    const onSubmit = React.useCallback(form => {
        const value = form.getValue();
        console.log(value)
        utils.Fetch("api/user/register", "POST", utils.GenerateFormDataFromObject(value).then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            }else {
                res.json().then(res => {
                    Notify.success(res.Msg)
                    closeDialog(registerID)
                })
            }
        }))
    }, []);
    return (
        <Form
            form={form}
            layout="vertical"
            scrollToError
            onSubmit={onSubmit}
        >
            <FormInputField
                name="name"
                label="昵称："
                required
                validators={[
                    Validators.required('请填写昵称'),
                    Validators.pattern(/^[a-zA-Z]+$/, '昵称只能是字母'),
                ]}
            />
            <FormInputField
                name="passwd"
                label="密码："
                required
                validators={[Validators.required('请填写密码')]}
                props={{
                    type: 'password',
                }}
            />
            <FormInputField
                name="confirmPw"
                label="确认密码："
                required
                validators={[equalsPassword]}
                props={{
                    type: 'password',
                }}
            />
            <FormInputField
                name="email"
                label="邮件"
                validators={[Validators.email('请填写正确的邮件')]}
            />
            <div className="zent-form-actions">
                <Button type="primary" onClick={() => {form.submit()}}>
                    注册
                </Button>
                <Button type="primary" outline onClick={resetForm}>
                    重置
                </Button>
            </div>
        </Form>
    );
}

function LoginForm() {
    const form = Form.useForm(FormStrategy.View);
    const resetForm = useCallback(() => {
        form.resetValue();
    }, [form]);
    const onSubmit = React.useCallback(form => {
        const value = form.getValue();
        console.log(value)
        utils.Fetch(`/api/user/login`, 'POST', utils.GenerateFormDataFromObject(value)).then(res => {
            if (res.status !== 200) {
                res.json().then(res => Notify.error(res.Msg))
            } else {
                closeDialog(loginID)
            }
        })
    }, []);
    return (
        <Form
            form={form}
            layout="vertical"
            scrollToError
        >
            <FormInputField
                name="name"
                label="昵称："
                required="请选择类型"
                props={{
                    spellCheck: false,
                }}
            />
            <FormInputField
                name="email"
                label="邮件"
                validators={[Validators.email('请填写正确的邮件')]}
            />
            <FormInputField
                name="passwd"
                label="密码："
                required
                validators={[Validators.required('请填写密码')]}
                props={{
                    type: 'password',
                }}
            />
            <div className="zent-form-actions">
                <Button type="primary" onClick={() => {form.submit()} }>
                    登录
                </Button>
                <Button type="primary" outline onClick={resetForm}>
                    重置
                </Button>
            </div>
        </Form>
    );
}

const register = () => {
    openDialog({
        dialogId: registerID,
        title: "注册",
        children: <>  <RegisterForm /> </>,
        footer : (<> <Button onClick={() => closeDialog(registerID)}>关闭</Button> </>),
        style: {
            "min-width":"10px",
        }
    })
}

const login = () => {
    openDialog({
        dialogId: loginID,
        title: "登录",
        children: <>  <LoginForm /> </>,
        footer : (<> <Button onClick={() => closeDialog(loginID)}>关闭</Button> </>),
        style: {
            "min-width":"10px",
        }
    })
}

function User(props) {
    refresher = props.refresher
    return (
        <>
            <Button onClick={register}>
                注册
            </Button>

            <Button type="primary" outline onClick={login}>
                登录
            </Button>
        </>
    )
}

export default User;