"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Input } from "../Input";
import { Button } from "../Button";
import { ConsentCheckbox } from "../ConsentCheckbox";
import { Icon } from "@iconify/react";
import { isValidEmail } from "@/utils";
import { createUser } from "@/lib/api";
import { toast } from "react-toastify";
import clsx from "clsx";

interface ModalFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormState {
  name: string;
  email: string;
  password: string;
}

const formDefaultValue = {
  name: "",
  email: "",
  password: "",
};

export const ModalForm = ({ isOpen, onClose }: ModalFormProps) => {
  const [accepted, setAccepted] = useState(false);
  const [visible, setVisible] = useState(true);
  const [form, setForm] = useState<FormState>(formDefaultValue);
  const [errors, setErrors] = useState<FormState>(formDefaultValue);

  useEffect(() => {
    setAccepted(false);
    setErrors(formDefaultValue);
    setVisible(true);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleAccepted = () => {
    setAccepted(!accepted);
  };

  const handleInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!visible) return;
    setForm((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const validateInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!visible) return;
    setErrors((prev) => ({
      ...prev,
      [id]: value ? "" : "Preencha este campo corretamente.",
    }));
  };

  const validateEmailValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (!visible) return;
    setErrors((prev) => ({
      ...prev,
      [id]: isValidEmail(value) ? "" : "Preencha este campo corretamente.",
    }));
  };

  const isDisabled = () => !accepted || Object.values(errors).some((error) => error !== "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = {
      name: form.name ? "" : "Preencha este campo corretamente.",
      email: isValidEmail(form.email)
        ? ""
        : "Preencha este campo corretamente.",
      password: form.password ? "" : "Preencha este campo corretamente.",
    };

    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors || !accepted) return;

    try {
      await createUser(form);
      toast.success("Conta criada com sucesso!");
      onClose();
      setForm(formDefaultValue);
      setAccepted(false);
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Erro inesperado ao criar conta.");
      }
    }

  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => {
      onClose();
    }, 800);
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
            src="/modal-register.png"
            alt="Pessoa ao lado de um smartphone exibindo uma interface com botão ativado, simbolizando a criação de conta."
          />

          <h2 className="text-xl font-bold">
            Preencha os campos abaixo para criar sua conta corrente!
          </h2>

          <Input
            id="name"
            value={form.name}
            error={visible ? errors.name : ""}
            onBlur={validateInputValue}
            onChange={handleInputValue}
            label="Nome"
            placeholder="Digite seu nome completo"
            variant="form"
          />
          <Input
            type="email"
            id="email"
            value={form.email}
            error={visible ? errors.email : ""}
            onChange={handleInputValue}
            onBlur={validateEmailValue}
            label="E-mail"
            placeholder="Digite seu email"
            variant="form"
          />
          <Input
            id="password"
            value={form.password}
            error={visible ? errors.password : ""}
            onChange={handleInputValue}
            onBlur={validateInputValue}
            type="password"
            label="Senha"
            placeholder="Digite sua senha"
            variant="form"
          />

          <ConsentCheckbox checked={accepted} onChange={handleAccepted} />

          <Button variant="red" type="submit" disabled={isDisabled()}>
            Criar conta
          </Button>
        </form>
      </div>
    )
  );
};
