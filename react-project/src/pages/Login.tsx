import { login, verifyToken, getCaptchaApi } from "@/api/sys/login";
import useUserStore from "@/store/modules/user";
import { getAuthToken } from "@/utils"
import "@/style/login.scss";

const layout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
};

const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};

const Login: React.FC = () => {
  const [form] = Form.useForm();
  const token = getAuthToken();
  const navigate = useNavigate();
  const login = useUserStore(state => state.login)

  useEffect(()=>{
    if(token){
      verifyToken(token)
      // useMessage().createMessage.success('已登录')
      navigate('/test')
    }
  },[token])

  async function getCaptcha(){
    const res = await getCaptchaApi()
    setCaptchaSvg(res.data)
  }

  const [captchaSvg, setCaptchaSvg] = useState('')

  useEffect(()=>{
    getCaptcha()
  },[])

  const onFinish = async(values: any) => {
    // console.log(values);
    // const token = await login(values);
    // localStorage.setItem('token',token)
    // navigate('/test')
    await login(values)
  };

  const onReset = () => {
    form.resetFields();
  };


  const inputBaseProps = {
    allowClear: true,
  }

  return (
    <div className="login">
      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="username" label="Username" rules={[{ required: true }]}>
          <Input {...inputBaseProps} />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input {...inputBaseProps} visibility-toggle="true" type="password" />
        </Form.Item>
        <Form.Item name="captcha" label="Captcha" rules={[{ required: true }]}>
          <Input {...inputBaseProps}  />
        </Form.Item>
        <div onClick={getCaptcha} className="captcha" dangerouslySetInnerHTML={{ __html: captchaSvg }}>
        </div>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary"  htmlType="submit">
              登录
            </Button>
            <Button htmlType="button"  onClick={onReset}>
              注册
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;