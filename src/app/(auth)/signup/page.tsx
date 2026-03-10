"use client";

import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AlertCircle, CheckCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import Image from "next/image";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profession, setProfession] = useState("");
  const [address, setAddress] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  // Popup states
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if required fields are filled
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !profession ||
      !country ||
      !address ||
      !zipCode ||
      !city ||
      !agreePrivacy
    ) {
      setShowError(true);
      setErrorMessage(
        "Veuillez remplir tous les champs requis et accepter la Politique de confidentialité.",
      );
      return;
    }

    if (password !== confirmPassword) {
      setShowError(true);
      setErrorMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    setIsLoading(true);
    setShowError(false);

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        // The additional fields will just be passed and possibly ignored if not supported by the schema,
        // or stored in `additionalFields` if configured later.
        address,
        zipCode,
        city,
        country,
        profession,
        agreeMarketing,
      } as Parameters<typeof authClient.signUp.email>[0]); // Type-casting since additional fields might be custom

      if (error) {
        throw new Error(error.message || "Failed to create account");
      }

      // Show success popup and redirect
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/signin");
      }, 3000);
    } catch (err: unknown) {
      setShowError(true);
      let message = "Unknown error";
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === "object" && err !== null && "message" in err) {
        const maybeMessage = (err as { message?: unknown }).message;
        message =
          typeof maybeMessage === "string"
            ? maybeMessage
            : String(maybeMessage ?? "Unknown error");
      }
      setErrorMessage(`Erreur lors de la création du compte: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const FloatingPlaceholder = ({
    text,
    required = false,
  }: {
    text: string;
    required?: boolean;
  }) => (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#7f8e9c] pointer-events-none">
      {text} {required && <span className="text-red-500">*</span>}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f1f3f6] flex items-center justify-center p-4">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-green-700 mb-2">
              Compte créé avec succès !
            </h2>
            <p className="text-gray-600 mb-4">
              Votre compte est en attente de validation par un administrateur.
              Vous pourrez vous connecter une fois approuvé.
            </p>
            <p className="text-gray-500 text-sm">Redirection en cours...</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-[1100px] bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[700px]">
        {/* Left Side - Image Placeholder */}
        <div className="md:w-[45%] bg-[#a3c3d5] relative overflow-hidden hidden md:block">
          <Image
            src="/image.png" // Fallback placeholder if actual image is missing, the user can replace this
            alt="Diamond Professional"
            layout="fill"
            objectFit="cover"
            className="object-cover object-top"
          />
          {/* If /image.png doesn't match perfectly, it acts as a very good placeholder given the style */}
        </div>

        {/* Right Side - Form */}
        <div className="md:w-[55%] p-8 md:p-12 lg:p-14 flex flex-col justify-center">
          <div className="w-full max-w-[480px] mx-auto">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-bold text-[#1e4e7e] mb-3">
                Rejoignez-nous !
              </h1>
              <p className="text-[#1e4e7e] font-semibold text-lg leading-tight">
                Rejoignez l'aventure Diamond en fournissant
                <br />
                les informations suivantes
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-12 bg-[#f8f9fa] border-none text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-blue-200"
                  />
                  {!name && (
                    <FloatingPlaceholder text="Nom et prénom" required />
                  )}
                </div>

                <div className="relative">
                  <Input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-[#f8f9fa] border-none text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-blue-200"
                  />
                  {!email && <FloatingPlaceholder text="Email" required />}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <Input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-[#f8f9fa] border-none text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-blue-200"
                  />
                  {!password && (
                    <FloatingPlaceholder text="Mot de passe" required />
                  )}
                </div>

                <div className="relative">
                  <Input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-[#f8f9fa] border-none text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-blue-200"
                  />
                  {!confirmPassword && (
                    <FloatingPlaceholder
                      text="Confirmez le mot de passe"
                      required
                    />
                  )}
                  {confirmPassword && password === confirmPassword && (
                    <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-green-500" />
                  )}
                </div>
              </div>

              {/* Roles */}
              <div className="space-y-3 pt-2">
                <p className="text-sm font-bold text-[#1e4e7e]">
                  Vous êtes <span className="text-red-500">*</span>
                </p>
                <RadioGroup
                  value={profession}
                  onValueChange={setProfession}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Dentiste"
                      id="dentiste"
                      className="border-[#1e4e7e] text-[#1e4e7e]"
                    />
                    <label
                      htmlFor="dentiste"
                      className="text-sm font-semibold text-gray-800 cursor-pointer"
                    >
                      Dentiste
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value="Orthodontiste"
                      id="orthodontiste"
                      className="border-[#1e4e7e] text-[#1e4e7e]"
                    />
                    <label
                      htmlFor="orthodontiste"
                      className="text-sm font-semibold text-gray-800 cursor-pointer"
                    >
                      Orthodontiste
                    </label>
                  </div>
                </RadioGroup>
              </div>

              {/* Extra address fields requested by user */}
              <div className="space-y-4 pt-2">
                <div className="relative">
                  <Input
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="h-12 bg-[#f8f9fa] border-none text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-blue-200"
                  />
                  {!address && <FloatingPlaceholder text="Adresse" required />}
                </div>

                <div className="flex space-x-4">
                  <div className="relative w-1/3">
                    <Input
                      required
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="h-12 bg-[#f8f9fa] border-none text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-blue-200"
                    />
                    {!zipCode && (
                      <FloatingPlaceholder text="Code postal" required />
                    )}
                  </div>
                  <div className="relative w-2/3">
                    <Input
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="h-12 bg-[#f8f9fa] border-none text-gray-800 text-sm focus-visible:ring-1 focus-visible:ring-blue-200"
                    />
                    {!city && <FloatingPlaceholder text="Ville" required />}
                  </div>
                </div>
              </div>

              {/* Country */}
              <div className="space-y-2 pt-2">
                <p className="text-sm font-bold text-[#1e4e7e]">
                  Pays <span className="text-red-500">*</span>
                </p>
                <Select value={country} onValueChange={setCountry}>
                  <SelectTrigger className="h-12 bg-[#f8f9fa] border-none text-gray-700 text-sm focus:ring-1 focus:ring-blue-200 w-full">
                    <SelectValue placeholder="Sélectionnez" />
                  </SelectTrigger>
                  <SelectContent
                    position="popper"
                    className="w-full bg-white border rounded-md shadow-lg max-h-[300px] z-[100] overflow-y-auto"
                  >
                    {[
                      "Afghanistan",
                      "Afrique du Sud",
                      "Albanie",
                      "Algérie",
                      "Allemagne",
                      "Andorre",
                      "Angola",
                      "Antigua-et-Barbuda",
                      "Arabie Saoudite",
                      "Argentine",
                      "Arménie",
                      "Australie",
                      "Autriche",
                      "Azerbaïdjan",
                      "Bahamas",
                      "Bahreïn",
                      "Bangladesh",
                      "Barbade",
                      "Belgique",
                      "Belize",
                      "Bénin",
                      "Bhoutan",
                      "Biélorussie",
                      "Birmanie",
                      "Bolivie",
                      "Bosnie-Herzégovine",
                      "Botswana",
                      "Brésil",
                      "Brunei",
                      "Bulgarie",
                      "Burkina Faso",
                      "Burundi",
                      "Cabo Verde",
                      "Cambodge",
                      "Cameroun",
                      "Canada",
                      "Chili",
                      "Chine",
                      "Chypre",
                      "Colombie",
                      "Comores",
                      "Congo",
                      "Costa Rica",
                      "Côte d'Ivoire",
                      "Croatie",
                      "Cuba",
                      "Danemark",
                      "Djibouti",
                      "Dominique",
                      "Égypte",
                      "Émirats arabes unis",
                      "Équateur",
                      "Érythrée",
                      "Espagne",
                      "Estonie",
                      "Eswatini",
                      "États-Unis",
                      "Éthiopie",
                      "Fidji",
                      "Finlande",
                      "France",
                      "Gabon",
                      "Gambie",
                      "Géorgie",
                      "Ghana",
                      "Grèce",
                      "Grenade",
                      "Guatemala",
                      "Guinée",
                      "Guinée-Bissau",
                      "Guinée équatoriale",
                      "Guyana",
                      "Haïti",
                      "Honduras",
                      "Hongrie",
                      "Îles Marshall",
                      "Îles Salomon",
                      "Inde",
                      "Indonésie",
                      "Irak",
                      "Iran",
                      "Irlande",
                      "Islande",
                      "Italie",
                      "Jamaïque",
                      "Japon",
                      "Jordanie",
                      "Kazakhstan",
                      "Kenya",
                      "Kirghizistan",
                      "Kiribati",
                      "Koweït",
                      "Laos",
                      "Lesotho",
                      "Lettonie",
                      "Liban",
                      "Liberia",
                      "Libye",
                      "Liechtenstein",
                      "Lituanie",
                      "Luxembourg",
                      "Macédoine du Nord",
                      "Madagascar",
                      "Malaisie",
                      "Malawi",
                      "Maldives",
                      "Mali",
                      "Malte",
                      "Maroc",
                      "Maurice",
                      "Mauritanie",
                      "Mexique",
                      "Micronésie",
                      "Moldavie",
                      "Monaco",
                      "Mongolie",
                      "Monténégro",
                      "Mozambique",
                      "Namibie",
                      "Nauru",
                      "Népal",
                      "Nicaragua",
                      "Niger",
                      "Nigeria",
                      "Norvège",
                      "Nouvelle-Zélande",
                      "Oman",
                      "Ouganda",
                      "Ouzbékistan",
                      "Pakistan",
                      "Palaos",
                      "Panama",
                      "Papouasie-Nouvelle-Guinée",
                      "Paraguay",
                      "Pays-Bas",
                      "Pérou",
                      "Philippines",
                      "Pologne",
                      "Portugal",
                      "Qatar",
                      "République centrafricaine",
                      "République démocratique du Congo",
                      "République dominicaine",
                      "Roumanie",
                      "Royaume-Uni",
                      "Russie",
                      "Rwanda",
                      "Saint-Kitts-et-Nevis",
                      "Saint-Marin",
                      "Saint-Vincent-et-les-Grenadines",
                      "Sainte-Lucie",
                      "Salvador",
                      "Samoa",
                      "Sao Tomé-et-Principe",
                      "Sénégal",
                      "Serbie",
                      "Seychelles",
                      "Sierra Leone",
                      "Singapour",
                      "Slovaquie",
                      "Slovénie",
                      "Somalie",
                      "Soudan",
                      "Soudan du Sud",
                      "Sri Lanka",
                      "Suède",
                      "Suisse",
                      "Suriname",
                      "Syrie",
                      "Tadjikistan",
                      "Tanzanie",
                      "Tchad",
                      "Tchéquie",
                      "Thaïlande",
                      "Timor oriental",
                      "Togo",
                      "Tonga",
                      "Trinité-et-Tobago",
                      "Tunisie",
                      "Turkménistan",
                      "Turquie",
                      "Tuvalu",
                      "Ukraine",
                      "Uruguay",
                      "Vanuatu",
                      "Vatican",
                      "Venezuela",
                      "Viêt Nam",
                      "Yémen",
                      "Zambie",
                      "Zimbabwe",
                    ].map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Checkboxes */}
              <div className="space-y-5 pt-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="privacy"
                    checked={agreePrivacy}
                    onCheckedChange={(checked) =>
                      setAgreePrivacy(checked as boolean)
                    }
                    className="mt-1 border-blue-400"
                  />
                  <label
                    htmlFor="privacy"
                    className="text-xs text-[#1e4e7e] leading-snug cursor-pointer"
                  >
                    En cochant cette case et en cliquant sur « Soumettre »,
                    j'accepte que mes données personnelles soient traitées
                    conformément à la Politique en matière de confidentialité.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="marketing"
                    checked={agreeMarketing}
                    onCheckedChange={(checked) =>
                      setAgreeMarketing(checked as boolean)
                    }
                    className="mt-1 border-blue-400"
                  />
                  <label
                    htmlFor="marketing"
                    className="text-xs text-[#1e4e7e] leading-snug cursor-pointer"
                  >
                    En cochant cette case et en cliquant sur « Soumettre »,
                    j'accepte de recevoir des communications électroniques de
                    Diamond® contenant des informations sur le traitement
                    Diamond®, les produits et services, les enquêtes, ainsi que
                    d'autres informations que nous jugeons pertinentes pour
                    vous.
                  </label>
                </div>
              </div>

              {showError && (
                <Alert
                  variant="destructive"
                  className="py-2 mt-4 bg-red-50 border-red-200 text-red-800"
                >
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm ml-2">
                    {errorMessage}
                  </AlertDescription>
                </Alert>
              )}

              {/* Submit Action */}
              <div className="pt-6 pb-2 text-center">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full max-w-[280px] h-12 bg-[#00b4b4] hover:bg-[#009c9c] text-white rounded-md text-base font-semibold transition-colors"
                >
                  {isLoading ? "Création en cours..." : "Créez votre compte"}
                </Button>
              </div>

              {/* Back to sign in */}
              <div className="text-center pb-4">
                <Link
                  href="/signin"
                  className="text-sm font-medium text-[#1e4e7e] hover:underline decoration-1 underline-offset-4"
                >
                  Déjà membre ?
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
