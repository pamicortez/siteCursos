"use client"

import React, { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import axios from "axios"
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, Building, FileText, LinkIcon, Camera } from 'lucide-react'
import ImageCropper from "@/components/ui/ImageCropper"

interface SignUpFormData {
  Nome: string
  email: string
  password: string
  confirmPassword: string
  emailVerificationCode: string
  isEmailVerified: boolean
  Titulacao: string
  instituicaoEnsino: string
  formacaoAcademica: string
  resumoPessoal: string
  fotoPerfil?: string
  links: Array<{
    tipo: string
    link: string
  }>
  publicacoes: Array<{
    descricao: string
    link: string
  }>
  carreira: Array<{
    nome: string
    descricao: string
    categoria: string
    dataInicio: string
    dataFim: string
  }>
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText,
  variant = 'default',
  showSpinner = false,
  centerText = false
}: {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText: string;
  variant?: 'default' | 'destructive';
  showSpinner?: boolean;
  centerText?: boolean;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full shadow-xl border border-gray-200">
        <h2 className="text-xl font-bold mb-4 text-center">{title}</h2>
        <p
          className={`mb-6 ${centerText ? 'text-center' : ''}`}
          style={centerText ? { whiteSpace: 'pre-line' } : undefined}
        >
          {message}
        </p>

        {/* Spinner */}
        {showSpinner && (
          <div className="flex justify-center mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Botões - só aparecem quando não está carregando */}
        {!showSpinner && (
          <div className="flex justify-end gap-4">
            {onClose && (
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition"
                onClick={onClose}
              >
                Continuar editando
              </button>
            )}
            <button
              className={`px-4 py-2 rounded-md transition ${variant === 'destructive'
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-black text-white hover:bg-gray-700'
                }`}
              onClick={onConfirm}
            >
              {confirmText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showImageCropper, setShowImageCropper] = useState(false)
  const [createdUserId, setCreatedUserId] = useState<string | null>(null)
  const [userCreated, setUserCreated] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isModalClosing, setIsModalClosing] = useState(false)
  const [showResultDialog, setShowResultDialog] = useState(false)
  const [resultDialog, setResultDialog] = useState({
    title: '',
    message: '',
    isError: false,
  })
  const [formData, setFormData] = useState<SignUpFormData>({
    Nome: "",
    email: "",
    password: "",
    confirmPassword: "",
    emailVerificationCode: "",
    isEmailVerified: false,
    Titulacao: "Bacharel",
    instituicaoEnsino: "",
    formacaoAcademica: "",
    resumoPessoal: "",
    fotoPerfil: "",
    links: [{ tipo: "Linkedin", link: "" }],
    publicacoes: [{ descricao: "", link: "" }],
    carreira: [
      {
        nome: "",
        descricao: "",
        categoria: "acadêmica",
        dataInicio: "",
        dataFim: "",
      },
    ],
  })
  const [isClient, setIsClient] = useState(false)
  const [isSendingCode, setIsSendingCode] = useState(false)
  const [isVerifyingCode, setIsVerifyingCode] = useState(false)
  const [showEmailSendingModal, setShowEmailSendingModal] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (status === "authenticated" && isClient) {
      router.push("/profile")
    }
  }, [status, router, isClient])

  useEffect(() => {
    if (formData.isEmailVerified && currentStep === 2) {
      setCurrentStep(3);
    }
  }, [formData.isEmailVerified, currentStep]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Limpar erro específico quando o usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleArrayInputChange = (
    arrayName: "links" | "publicacoes" | "carreira",
    index: number,
    field: string,
    value: string,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    }))
  }

  const addArrayItem = (arrayName: "links" | "publicacoes" | "carreira") => {
    const newItem = {
      links: { tipo: "Genérico", link: "" },
      publicacoes: { descricao: "", link: "" },
      carreira: {
        nome: "",
        descricao: "",
        categoria: "acadêmica",
        dataInicio: "",
        dataFim: "",
      },
    }

    setFormData((prev) => ({
      ...prev,
      [arrayName]: [...prev[arrayName], newItem[arrayName]],
    }))
  }

  const removeArrayItem = (arrayName: "links" | "publicacoes" | "carreira", index: number) => {
    setFormData((prev) => ({
      ...prev,
      [arrayName]: prev[arrayName].filter((_, i) => i !== index),
    }))
  }

  const handleImageUploadSuccess = (newImageBase64: string) => {
    setFormData((prev) => ({
      ...prev,
      fotoPerfil: newImageBase64,
    }))
    handleCloseModal()
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 1) {
      if (!formData.Nome.trim()) newErrors.Nome = "Nome é obrigatório"
      if (!formData.email.trim()) newErrors.email = "Email é obrigatório"
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email inválido"
      if (!formData.password) newErrors.password = "Senha é obrigatória"
      else if (formData.password.length < 8) newErrors.password = "Senha deve ter pelo menos 8 caracteres"
      if (!formData.confirmPassword) newErrors.confirmPassword = "Confirmação de senha é obrigatória"
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "Senhas não coincidem"
    } else if (step === 2) {
      if (!formData.emailVerificationCode) {
        newErrors.emailVerificationCode = "Código de verificação é obrigatório"
      } else if (formData.emailVerificationCode.length !== 6) {
        newErrors.emailVerificationCode = "Código deve ter 6 dígitos"
      }
    } else if (step === 3) {
      if (!formData.Titulacao) newErrors.Titulacao = "Titulação é obrigatória"
      if (!formData.instituicaoEnsino.trim()) newErrors.instituicaoEnsino = "Instituição de ensino é obrigatória"
      if (!formData.formacaoAcademica.trim()) newErrors.formacaoAcademica = "Formação acadêmica é obrigatória"
    } else if (step === 4) {
      // Validar experiências profissionais que têm nome preenchido
      formData.carreira.forEach((exp, index) => {
        if (exp.nome.trim() && !exp.descricao.trim()) {
          newErrors[`carreira_${index}_descricao`] = "Descrição da experiência não pode estar vazia"
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = async () => {
    if (validateStep(currentStep)) {
      if (currentStep === 1) {
        if (formData.isEmailVerified) {
          setCurrentStep(3);
        } else {
          // Mostrar modal de envio de e-mail
          setShowEmailSendingModal(true);
          await handleSendVerificationCode();
          setShowEmailSendingModal(false);
        }
      }
      else if (currentStep === 4) {
        await handleCreateAccount();
      }
      else {
        setCurrentStep(prev => Math.min(prev + 1, 5));
      }
    }
  }

  const handlePrevious = () => {
    if (currentStep === 3 && formData.isEmailVerified) {
      setCurrentStep(1);
    } else {
      setCurrentStep(prev => Math.max(prev - 1, 1));
    }
  }

  const handleCreateAccount = async () => {
    setLoading(true)
    try {
      const filteredData = {
        Nome: formData.Nome,
        email: formData.email,
        password: formData.password,
        Titulacao: formData.Titulacao,
        instituicaoEnsino: formData.instituicaoEnsino,
        formacaoAcademica: formData.formacaoAcademica,
        resumoPessoal: formData.resumoPessoal,
        fotoPerfil: formData.fotoPerfil || "",
        links: formData.links.filter((link) => link.link.trim() !== ""),
        publicacoes: formData.publicacoes.filter((pub) => pub.descricao.trim() !== "" || pub.link.trim() !== ""),
        carreira: formData.carreira.filter((exp) => exp.nome.trim() !== ""),
      }

      const response = await axios.post("/api/auth/signup", filteredData)

      if (response.status === 201) {
        setCreatedUserId(response.data.user.id.toString())
        setUserCreated(true)
        setCurrentStep(5) // Ir para a etapa da foto após sucesso

        // Mostrar modal de sucesso
        setResultDialog({
          title: 'Sucesso!',
          message: 'Conta criada com sucesso!',
          isError: false,
        })
        setShowResultDialog(true)
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error)

      // Mostrar modal de erro
      setResultDialog({
        title: 'Erro',
        message: error.response?.data?.error || 'Erro ao criar conta. Tente novamente.',
        isError: true,
      })
      setShowResultDialog(true)
    } finally {
      setLoading(false)
    }
  }

  const handleCloseModal = () => {
    setIsModalClosing(true)
    setTimeout(() => {
      setShowImageCropper(false)
      setIsModalClosing(false)
    }, 700) // Duração da animação de fade out
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
  }

  const handleFinish = () => {
    router.push("/login")
  }

  if (status === "loading" || !isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleSendVerificationCode = async () => {
    setIsSendingCode(true);
    try {
      const response = await axios.post("/api/solicitar-email", {
        email: formData.email
      });

      // Só mostrar modal de sucesso se não estiver dentro do fluxo do handleNext
      if (!showEmailSendingModal) {
        setResultDialog({
          title: 'Código enviado',
          message: 'Enviamos um código de verificação para seu e-mail.',
          isError: false
        });
        setShowResultDialog(true);
      }
      setCurrentStep(2);
    } catch (error: any) {
      if (error.response?.status === 409) {
        setErrors(prev => ({
          ...prev,
          email: 'Este email já está cadastrado'
        }));
        setCurrentStep(1);
        return;
      }

      setResultDialog({
        title: 'Erro',
        message: error.response?.data?.error || 'Falha ao enviar código. Tente novamente.',
        isError: true
      });
      setShowResultDialog(true);
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    setIsVerifyingCode(true)
    try {
      await axios.post("/api/validar-email", {
        email: formData.email,
        code: formData.emailVerificationCode
      })

      setFormData(prev => ({
        ...prev,
        isEmailVerified: true
      }))

      // Avança automaticamente para a próxima etapa
      setCurrentStep(3)

      setResultDialog({
        title: 'E-mail verificado',
        message: 'Seu e-mail foi confirmado com sucesso!',
        isError: false
      })
      setShowResultDialog(true)
    } catch (error: any) {
      setResultDialog({
        title: 'Erro',
        message: error.response?.data?.error || 'Código inválido. Tente novamente.',
        isError: true
      })
      setShowResultDialog(true)
    } finally {
      setIsVerifyingCode(false)
    }
  }

  const stepTitles = ["Informações Básicas", "Confirmação de E-mail", "Formação Acadêmica", "Experiência e Links", "Foto do Perfil"]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNext()
    }
  }

  const handleVerificationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (formData.emailVerificationCode && !isVerifyingCode) {
        handleVerifyCode()
      }
    }
  }

  const handleResumoKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleNext()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 pt-32 md:pt-8">
      <div className="max-w-4xl mx-auto px-4">


        {/* Progress Bar Mobile - Fixo como navbar */}
        <div className="fixed top-29 left-0 right-0 bg-white shadow-md z-39 md:hidden">
          <div className="px-4 py-3">
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Criar Conta</h1>
              <p className="text-gray-600 hidden md:block">Preencha os dados para criar sua conta</p>
            </div>
            <div className="flex items-center justify-center">
              {[1, 2, 3, 4, 5].map((step) => (
                <React.Fragment key={step}>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                    {step}
                  </div>
                  {step < 5 && (
                    <div className={`w-8 h-1 mx-1 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"
                      }`} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="text-center mt-1">
              <span className="text-xs text-gray-600">{stepTitles[currentStep - 1]}</span>
            </div>
          </div>
        </div>


        {/* Header - Apenas título no mobile, completo no desktop */}
        <div className="hidden bg-white rounded-lg shadow-md p-6 mb-6 md:block">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">Criar Conta</h1>
            <p className="text-gray-600 hidden md:block">Preencha os dados para criar sua conta</p>
          </div>

          {/* Progress Bar - Visível apenas no desktop */}
          <div className="hidden md:flex items-center justify-center mt-6">
            {[1, 2, 3, 4, 5].map((step) => (
              <React.Fragment key={step}>
                <div className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${step <= currentStep ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
                  }`}>
                  {step}
                </div>
                {step < 5 && (
                  <div className={`w-8 h-1 mx-1 ${step < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="text-center mt-2 hidden md:block">
            <span className="text-sm text-gray-600">{stepTitles[currentStep - 1]}</span>
          </div>
        </div>




        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-4">

              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      <strong>Atenção:</strong> Cadastro será liberado apenas para professores.
                    </p>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Informações Básicas</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User className="inline w-4 h-4 mr-1" />
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="Nome"
                    value={formData.Nome}
                    onChange={handleInputChange}
                    tabIndex={1}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Nome ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Digite seu nome completo"
                  />
                  {errors.Nome && <p className="text-red-500 text-xs mt-1">{errors.Nome}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail className="inline w-4 h-4 mr-1" />
                    Email *
                    {formData.isEmailVerified && (
                      <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        Verificado
                      </span>
                    )}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    tabIndex={2}
                    disabled={formData.isEmailVerified} // Bloqueia edição se verificado
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"
                      } ${formData.isEmailVerified ? "bg-gray-100 cursor-not-allowed" : ""}`}
                    placeholder="seu@email.com"
                  />
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Lock className="inline w-4 h-4 mr-1" />
                    Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      tabIndex={3}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.password ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Mínimo 8 caracteres"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Lock className="inline w-4 h-4 mr-1" />
                    Confirmar Senha *
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      tabIndex={4}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"
                        }`}
                      placeholder="Repita a senha"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Email Verification */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Confirmação de E-mail</h3>

              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <p className="text-blue-800">
                  Enviamos um código de verificação para <strong>{formData.email}</strong>.
                  Por favor, insira o código abaixo para confirmar seu e-mail.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código de Verificação *
                  </label>
                  <input
                    type="text"
                    name="emailVerificationCode"
                    value={formData.emailVerificationCode}
                    onChange={handleInputChange}
                    onKeyDown={handleVerificationKeyDown}
                    maxLength={6}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.emailVerificationCode ? "border-red-500" : "border-gray-300"}`}
                    placeholder="Código de 6 Dígitos"
                  />
                  {errors.emailVerificationCode && (
                    <p className="text-red-500 text-xs mt-1">{errors.emailVerificationCode}</p>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleSendVerificationCode}
                  disabled={isSendingCode}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition disabled:opacity-50"
                >
                  {isSendingCode ? 'Enviando...' : 'Reenviar Código'}
                </button>

                <button
                  type="button"
                  onClick={handleVerifyCode}
                  disabled={isVerifyingCode || !formData.emailVerificationCode}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {isVerifyingCode ? 'Verificando...' : 'Verificar Código'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Academic Information */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Formação Acadêmica</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <GraduationCap className="inline w-4 h-4 mr-1" />
                    Titulação *
                  </label>
                  <select
                    name="Titulacao"
                    value={formData.Titulacao}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.Titulacao ? "border-red-500" : "border-gray-300"
                      }`}
                  >
                    <option value="Bacharel">Bacharel</option>
                    <option value="Licenciado">Licenciado</option>
                    <option value="Especialista">Especialista</option>
                    <option value="Mestre">Mestre</option>
                    <option value="Doutor">Doutor</option>
                  </select>
                  {errors.Titulacao && <p className="text-red-500 text-xs mt-1">{errors.Titulacao}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Building className="inline w-4 h-4 mr-1" />
                    Instituição de Ensino *
                  </label>
                  <input
                    type="text"
                    name="instituicaoEnsino"
                    value={formData.instituicaoEnsino}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.instituicaoEnsino ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Nome da sua instituição"
                  />
                  {errors.instituicaoEnsino && <p className="text-red-500 text-xs mt-1">{errors.instituicaoEnsino}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <GraduationCap className="inline w-4 h-4 mr-1" />
                    Formação Acadêmica *
                  </label>
                  <input
                    type="text"
                    name="formacaoAcademica"
                    value={formData.formacaoAcademica}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.formacaoAcademica ? "border-red-500" : "border-gray-300"
                      }`}
                    placeholder="Ex: Ciência da Computação, Engenharia..."
                  />
                  {errors.formacaoAcademica && <p className="text-red-500 text-xs mt-1">{errors.formacaoAcademica}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Resumo Pessoal
                  </label>
                  <textarea
                    name="resumoPessoal"
                    value={formData.resumoPessoal}
                    onChange={handleInputChange}
                    onKeyDown={handleResumoKeyDown}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Fale um pouco sobre você, sua experiência e objetivos..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Experience and Links */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Experiência e Links (Opcional)</h3>

              {/* Links */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    <LinkIcon className="inline w-4 h-4 mr-1" />
                    Links Profissionais
                  </h4>
                  <button
                    type="button"
                    onClick={() => addArrayItem("links")}
                    className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-700"
                  >
                    + Adicionar Link
                  </button>
                </div>

                {formData.links.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">
                    <select
                      value={link.tipo}
                      onChange={(e) => handleArrayInputChange("links", index, "tipo", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Linkedin">LinkedIn</option>
                      <option value="Instragram">Instagram</option>
                      <option value="Facebook">Facebook</option>
                      <option value="Whatsapp">WhatsApp</option>
                      <option value="Genérico">Website</option>
                    </select>
                    <input
                      type="url"
                      value={link.link}
                      onChange={(e) => handleArrayInputChange("links", index, "link", e.target.value)}
                      placeholder="https://..."
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem("links", index)}
                      className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700"
                    >
                      Remover
                    </button>
                  </div>
                ))}
              </div>

              {/* Publications */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    <FileText className="inline w-4 h-4 mr-1" />
                    Publicações
                  </h4>
                  <button
                    type="button"
                    onClick={() => addArrayItem("publicacoes")}
                    className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-700"
                  >
                    + Adicionar Publicação
                  </button>
                </div>

                {formData.publicacoes.map((pub, index) => (
                  <div key={index} className="space-y-2 mb-4 p-3 border border-gray-200 rounded">
                    <input
                      type="text"
                      value={pub.descricao}
                      onChange={(e) => handleArrayInputChange("publicacoes", index, "descricao", e.target.value)}
                      placeholder="Descrição da publicação"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={pub.link}
                        onChange={(e) => handleArrayInputChange("publicacoes", index, "link", e.target.value)}
                        placeholder="Link da publicação"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        type="button"
                        onClick={() => removeArrayItem("publicacoes", index)}
                        className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700"
                      >
                        Remover
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Experience */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium text-gray-700">
                    <Building className="inline w-4 h-4 mr-1" />
                    Experiência Profissional
                  </h4>
                  <button
                    type="button"
                    onClick={() => addArrayItem("carreira")}
                    className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-700"
                  >
                    + Adicionar Experiência
                  </button>
                </div>

                {formData.carreira.map((exp, index) => (
                  <div key={index} className="space-y-2 mb-4 p-3 border border-gray-200 rounded">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={exp.nome}
                        onChange={(e) => handleArrayInputChange("carreira", index, "nome", e.target.value)}
                        placeholder="Nome da posição/cargo"
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <select
                        value={exp.categoria}
                        onChange={(e) => handleArrayInputChange("carreira", index, "categoria", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="acadêmica">Acadêmica</option>
                        <option value="profissional">Profissional</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input
                        type="date"
                        value={exp.dataInicio}
                        onChange={(e) => handleArrayInputChange("carreira", index, "dataInicio", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="date"
                        value={exp.dataFim}
                        onChange={(e) => handleArrayInputChange("carreira", index, "dataFim", e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <textarea
                        value={exp.descricao}
                        onChange={(e) => handleArrayInputChange("carreira", index, "descricao", e.target.value)}
                        placeholder="Descrição da experiência"
                        rows={2}
                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`carreira_${index}_descricao`] ? "border-red-500" : "border-gray-300"
                          }`}
                      />
                      {errors[`carreira_${index}_descricao`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`carreira_${index}_descricao`]}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeArrayItem("carreira", index)}
                      className="px-3 py-1 bg-black text-white rounded hover:bg-gray-700"
                    >
                      Remover Experiência
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Profile Photo */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">Foto do Perfil</h3>

              {/* Foto de Perfil */}
              <div className="flex justify-center mb-6">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center border-2 border-dashed border-gray-300">
                    {formData.fotoPerfil ? (
                      <img
                        src={formData.fotoPerfil || "/placeholder.svg"}
                        alt="Foto de perfil"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center">
                <p className="text-gray-600 mb-4">
                  Adicione uma foto de perfil para completar seu cadastro.
                </p>
                <button
                  type="button"
                  onClick={() => setShowImageCropper(true)}
                  className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
                >
                  Escolher Foto
                </button>
              </div>
            </div>
          )}

          {/* Navigation Buttons - New*/}
          {currentStep !== 2 && (
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <div>
                {currentStep > 1 && currentStep < 5 && (
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-500 transition"
                  >
                    Anterior
                  </button>
                )}
              </div>

              <div className="space-x-3">
                {currentStep === 5 ? (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
                  >
                    Sair
                  </button>
                ) : currentStep === 4 ? (
                  <button
                    type="submit"
                    disabled={loading}
                    onClick={handleNext}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Criando..." : "Criar Conta"}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-700 transition"
                  >
                    Próximo
                  </button>
                )}
              </div>
            </div>
          )}
        </form>

        {/* Login Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">
            Já tem uma conta?{" "}
            <a href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
              Faça login aqui
            </a>
          </p>
        </div>
      </div>

      {/* Modal do Image Cropper */}
      {showImageCropper && userCreated && createdUserId && (
        <div
          className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-all duration-700 ease-in-out ${isModalClosing
            ? 'bg-slate-600/0 backdrop-blur-none opacity-0'
            : 'bg-slate-600/40 backdrop-blur-sm opacity-100'
            }`}
          style={{
            backdropFilter: isModalClosing ? 'blur(0px)' : 'blur(8px)',
            background: isModalClosing
              ? 'rgba(71, 85, 105, 0)'
              : 'rgba(71, 85, 105, 0.4)'
          }}
        >
          <div
            className={`bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transform transition-all duration-700 ease-in-out ${isModalClosing
              ? 'scale-95 opacity-0 translate-y-4'
              : 'scale-100 opacity-100 translate-y-0'
              }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Escolher Foto de Perfil</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl transition-colors duration-200"
                >
                  ×
                </button>
              </div>
              <ImageCropper userId={createdUserId} onUploadSuccess={handleImageUploadSuccess} />
            </div>
          </div>
        </div>
      )}
      {/* Modal de Resultado */}
      <ConfirmationModal
        isOpen={showResultDialog}
        onConfirm={() => setShowResultDialog(false)}
        title={resultDialog.title}
        message={resultDialog.message}
        confirmText="OK"
        variant={resultDialog.isError ? 'destructive' : 'default'}
        centerText={true}
      />
      {/* Modal de Envio de E-mail */}
      <ConfirmationModal
        isOpen={showEmailSendingModal}
        onConfirm={() => { }}
        title="Enviando código de verificação"
        message={`Estamos enviando um código de verificação para:\n${formData.email}\nPor favor, aguarde...`}
        confirmText=""
        showSpinner={true}
        centerText={true}
      />
    </div>
  )
}