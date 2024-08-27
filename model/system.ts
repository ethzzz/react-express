const jwtConfig = require("../config/jwtConfig");
const svgCaptcha = require("svg-captcha");
import { AsyncResultCallback } from "async";
import { log } from "../framework/ms";
import { nestAdmin as db } from "../utils";
import { md5Encrypt } from "../utils";
import { execute, randomValue, formatDate } from "@/utils";
import async from "async";
import { checkAccountExists } from "u/user.util";
import { CreateUserArgs } from "#/user";

interface LoginBody {
  username: string;
  password: string;
  captcha: string;
}

interface RequestProps extends Request {
  session: {
    captcha: string;
  };
}

export const login = (
  req: RequestProps,
  args: LoginBody,
  callback: Function
) => {
  (global as any).ms.async.waterfall(
    [
      (cb: Function) => {
        checkAccount(args, cb);
      },
      (cb: Function) => {
        checkCaptcha(req, args.captcha, cb);
      },
      (cb: Function) => {
        const token = jwtConfig.createTokenCheck.getToken(args);
        cb(null, "Bearer " + token);
      },
    ],
    callback
  );
};
function checkAccount(args: LoginBody, callback: Function) {
  if (!args.username || !args.password) {
    return callback("用户名或密码不能为空");
  }
  (global as any).ms.async.waterfall(
    [
      (cb: Function) => {
        db.execute(
          `select * from sys_user where username = ?`,
          [args.username],
          (err: Error, result: any) => {
            if (err) {
              return cb(err);
            }
            if (result.length === 0) {
              return cb("用户名或密码错误");
            }
            cb(null, result[0]);
          }
        );
      },
      (user: any, cb: Function) => {
        if (user.password !== md5Encrypt(`${args.password}${user.psalt}`)) {
          // console.error('密码错误')
          // console.log(user.password,args.password,md5Encrypt(args.password))
          return cb("用户名或密码错误");
        }
        cb();
      },
    ],
    callback
  );
}

function checkCaptcha(req: RequestProps, captcha: string, callback: Function) {
  if (!req.session.captcha || !captcha) {
    return callback("验证码错误");
  }
  if (req.session.captcha.toLowerCase() !== captcha.toLowerCase()) {
    return callback("验证码错误");
  }
  callback(null);
}

export const getCaptcha = (args: any, callback: Function) => {
  (global as any).ms.async.waterfall(
    [
      (cb: Function) => {
        const captcha = svgCaptcha.create({
          size: 4,
          ignoreChars: "0o1i",
          noise: 2,
          color: true,
        });
        cb(null, captcha);
      },
    ],
    callback
  );
};

// 注册register
export const register = (
  args: any,
  callback: AsyncResultCallback<any, any>
) => {
  async.waterfall(
    [
      (cb: AsyncResultCallback<any, any>) => {
        checkAccountExists(args.username, cb);
      },
      (exist: boolean, cb: AsyncResultCallback<any, any>) => {
        if (exist) {
          return cb("用户名已存在");
        }
        createUser(args, cb);
      },
    ],
    callback
  );
};

const createUser = (
  args: CreateUserArgs,
  callback: AsyncResultCallback<any, any>
) => {
  async.waterfall(
    [
      (cb: AsyncResultCallback<any, any>) => {
        args.psalt = randomValue(32)
        createUserSql(args, cb);
      },
    ],
    callback
  );
};

const createUserSql = (
  args: CreateUserArgs,
  callback: AsyncResultCallback<any, any>
) => {
  execute(
    "createUserSql",
    db,
    `insert into sys_user (username,password,avatar,email,phone,remark,psalt,qq,created_at,updated_at,nickname,dept_id) values (?,?,?,?,?,?,?,?,?,?,?,?)`,
    [args.username, md5Encrypt(`${args.password}${args.psalt}`),'', args.email, args.phone, args.remark, args.psalt, args.qq || '', formatDate(new Date(),"YYYY-MM-DD HH:mm:ss"), formatDate(new Date(),"YYYY-MM-DD HH:mm:ss"), args.nickname, 1],
    callback
  );
};
