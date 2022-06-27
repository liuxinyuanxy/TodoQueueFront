import { useCallback, useMemo } from 'react';
import {
  Form,
  Select,
  NumberInput,
  Notify,
  FormStrategy,
  FormControl,
  Button,
  FieldSet,
  FieldUtils,
  Validators,
  FormError,
} from 'zent';

const { SelectTrigger } = Select;
const countyCodeList = [
  {
    code: '+86',
    zh: 'zhongguo',
    eng: 'china',
    text: '中国 +86',
    key: 0,
  },
  {
    code: '+853',
    zh: 'aomen',
    eng: 'Macau',
    text: '中国澳门 +853',
    key: 1,
  },
];

const filterHandler = (item, keyword) => {
  return !!(
      keyword &&
      item.text
          .trim()
          .toLowerCase()
          .indexOf(keyword.trim().toLowerCase()) > -1
  );
};

function getValue(value) {
  return value;
}

const ContactPhone = () => {
  const select = Form.useField('areacode', countyCodeList[0]);
  const input = Form.useField('mobile', '', [
    Validators.pattern(/^\d{1,10}$/, '请输入正确的手机号'),
  ]);
  const onSelectChange = FieldUtils.useMulti(
      useCallback(() => {
        select.isTouched = true;
      }, [select]),
      FieldUtils.usePipe(
          getValue,
          FieldUtils.useChangeHandler(select, Form.ValidateOption.Default)
      )
  );
  const onPhoneNumChange = FieldUtils.useChangeHandler(
      input,
      Form.ValidateOption.Default
  );
  return (
      <FormControl
          className="form-demo-multiple-value"
          label="联系方式："
          invalid={!!select.error || !!input.error}
      >
        <Select
            className="areacode"
            options={countyCodeList}
            filter={filterHandler}
            trigger={SelectTrigger}
            width={160}
            value={select.value}
            onChange={onSelectChange}
        />
        <NumberInput
            style={{ marginLeft: 16 }}
            className="phone-num"
            placeholder="请填写手机号"
            width={160}
            value={input.value}
            {...FieldUtils.useCompositionHandler(input)}
            onChange={onPhoneNumChange}
            onBlur={useCallback(() => {
              input.isTouched = true;
              input.validate();
            }, [input])}
        />
        <Form.CombineErrors models={[select, input]} />
      </FormControl>
  );
};

const App = () => {
  const form = Form.useForm(FormStrategy.View);
  const getFormValues = useCallback(() => {
    const values = form.getValue();
    console.log(values);
  }, [form]);
  const resetForm = useCallback(() => {
    form.resetValue();
  }, [form]);
  return (
      <Form form={form} layout="horizontal">
        <FieldSet name="contactPhone">
          <ContactPhone />
        </FieldSet>
        <div className="zent-form__form-actions">
          <Button type="primary" onClick={getFormValues}>
            获取表单值
          </Button>{' '}
          <Button type="primary" outline onClick={resetForm}>
            重置表单值
          </Button>
        </div>
      </Form>
  );
};
export default App;
