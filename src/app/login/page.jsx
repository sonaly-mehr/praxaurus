import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import LoginForm from "../../components/ui/Forms/LoginForm";

export default function Register() {
  return (
    <div className="flex h-screen w-full justify-center items-center">
      <Card className="w-[400px] mx-auto ">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
