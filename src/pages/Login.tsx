import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { useEffect, useState } from "react";
import { LoginUser } from "../services/auth";
import { useMutation } from "@tanstack/react-query";
import { useAuthSore } from "../components/hooks/useAuth";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const location = useLocation();
  const from = (user_type: string) =>
    location.state?.from?.pathname || `/app/${user_type}`;

  const { setAuth } = useAuthSore();
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: LoginUser,
    onSuccess: (data) => {
      setAuth(data.DATA);
      switch (data.DATA.user_type) {
        case 1:
          navigate(from("user"), { replace: true });
          break;
        case 2:
          navigate(from("driver"), { replace: true });
          break;
        default:
          break;
      }
    },
    onError: (err) => {
      // @ts-expect-error - It should've the response method
      setErr(err.response.data.MESSAGE);
    },
  });

  useEffect(() => {
    setErr("");
  }, [values.email, values.password]);

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutate(values);
  };

  return (
    <form className="h-screen w-full flex items-center " onSubmit={handleLogin}>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Enter your email and password to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {err && (
              <div className="p-2 text-sm font-medium rounded-md bg-red-400 text-white">
                {err}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="lawrenceishim@gmail.com"
                required
                value={values.email}
                onChange={(e) =>
                  setValues({ ...values, email: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={values.password}
                onChange={(e) =>
                  setValues({ ...values, password: e.target.value })
                }
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
}
