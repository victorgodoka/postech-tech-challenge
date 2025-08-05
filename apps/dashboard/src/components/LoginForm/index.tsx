"use client";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "../Input";
import { Button } from "../Button";
import { Icon } from "@iconify/react";
import { isValidEmail } from "@/utils";
import { useAuth } from "@/hooks/redux/useAuth";
import { toast } from "react-toastify";

interface LoginFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  email: string;
  password: string;
}

const formDefaultValue = {
  name: "",
  email: "",
  password: "",
};

export const LoginForm = ({ isOpen, onClose }: LoginFormProps) => {
  const [form, setForm] = useState<FormState>(formDefaultValue);
  const [errors, setErrors] = useState<FormState>(formDefaultValue);
  const [visible, setVisible] = useState(true);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    setErrors(formDefaultValue);
    setVisible(true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 800);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      email: isValidEmail(form.email)
        ? ""
        : "Preencha este campo corretamente.",
      password: form.password ? "" : "Preencha este campo corretamente.",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    try {
      await login(form.email, form.password);
      toast.success("Login realizado com sucesso!");

      onClose();
      setForm({ email: "", password: "" });

      router.push("/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro inesperado ao fazer login.");
      }
    }
  };

  return (
    isOpen && (
      <div
        className="absolute top-0 left-0 w-full h-full bg-black/75 flex items-center justify-center z-50 px-8 md:px-12"
        role="dialog"
        aria-modal="true"
      >
        <form
          onSubmit={handleSubmit}
          className={clsx(
            "w-full max-w-3xl bg-offwhite h-full px-12 md:px-24 py-12 flex flex-col items-center shadow-lg relative gap-8",
            visible
              ? "animate-fade-up animate-once animate-duration-[750ms]"
              : "animate-fade animate-once animate-reverse animate-duration-[750ms]"
          )}
        >
          <button
            type="button"
            className="absolute p-1 rounded-full right-2 top-2 bg-gray-dark cursor-pointer"
            onClick={handleClose}
            aria-label="Fechar modal"
          >
            <Icon
              icon="material-symbols:close"
              className="text-white text-2xl"
            />
          </button>
          <Image
            width={355}
            height={261}
            src="/modal-login.png"
            alt="Pessoa ao lado de um notebook com símbolo de cadeado, representando acesso seguro à conta."
          />

          <h2 className="text-xl font-bold">Login</h2>

          <Input
            id="email"
            type="email"
            value={form.email}
            error={errors.email}
            onChange={handleInputValue}
            label="E-mail"
            placeholder="Digite seu email"
            variant="form"
          />
          <Input
            id="password"
            value={form.password}
            error={errors.password}
            onChange={handleInputValue}
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            variant="form"
          />

          <Link href="#" className="underline text-green my-2">
            Esqueci minha senha
          </Link>
          <Button variant="secondary" type="submit">
            Acessar
          </Button>
        </form>
      </div>
    )
  );
};
