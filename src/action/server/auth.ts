"use server";
interface registerProps {
  name: string;
  email: string;
  role: string;
  password: string;
}
interface loginProps {
  name: string;
  email: string;
  role: string;
  password: string;
}
export const postUser = async (payload: registerProps) => {
  const { name, email, role, password } = payload;

  if (!email || !password) {
    return null;
  }
};

// login user
export const loginUser = async (payload: loginProps) => {
  const { email, password } = payload;
  if (!email || !password) {
    return null;
  }
};
