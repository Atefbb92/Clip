'use client';

import React, { useState } from "react";
import {
  db,
  addDoc,
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DiamondCard as Card,
  DiamondCardContent as CardContent,
  DiamondCardDescription as CardDescription,
  DiamondCardHeader as CardHeader,
  DiamondCardTitle as CardTitle,
} from "@/components/ui/diamond-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle, AlertCircle } from "lucide-react";

const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [medicalLicenseNumber, setMedicalLicenseNumber] = useState("");
  const [reason, setReason] = useState("");
  const [referralSources, setReferralSources] = useState({
    search: false,
    social: false,
    friend: false,
    event: false,
    other: false
  });

  // Popup states
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are filled
    if (!name || !email || !role || !country || !city || !phoneNumber) {
      setShowError(true);
      setErrorMessage("Please fill in all required fields!");
      return;
    }

    setIsLoading(true);
    setShowError(false);

    try {
      // Check if user exists in candidates collection and if emailSend = 1
      const candidatesRef = collection(db, "candidates");
      const q = query(candidatesRef, where("email", "==", email), where("emailSent", "==", 1));
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        setShowError(true);
        setErrorMessage("Your email is not authorized or has not yet been validated.");
        setIsLoading(false);
        return;
      }

      // Get the candidate document
      const candidateDoc = querySnapshot.docs[0];
      const candidateData = candidateDoc.data();
      
      if (!candidateData.uid) {
        setShowError(true);
        setErrorMessage("Your account is not properly configured. Please contact the administrator.");
        setIsLoading(false);
        return;
      }
      
      const uid = candidateData.uid;

      // Check if this is an admin candidate
      if (candidateData.isAdmin) {
        // Add user to admins collection
        await addDoc(collection(db, "admins"), {
          name: candidateData.adminData.name,
          email: candidateData.email,
          role: candidateData.adminData.role,
          phone: candidateData.adminData.phone,
          uid: uid,
          createdAt: new Date(),
        });
      } else {
        // Add user to medecins collection
        await addDoc(collection(db, "medecins"), {
          name,
          email,
          role,
          country,
          city,
          phoneNumber,
          medicalLicenseNumber,
          reason,
          uid: uid,
          createdAt: new Date(),
        });
      }

      // Delete the user from candidates collection
      const candidateRef = doc(db, "candidates", candidateDoc.id);
      await deleteDoc(candidateRef);
      
      // Show success popup and redirect
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        router.push("/signin");
      }, 3000);
      
      // Reset form fields
      setName("");
      setEmail("");
      setRole("");
      setCountry("");
      setCity("");
      setPhoneNumber("");
      setMedicalLicenseNumber("");
      setReason("");
      setReferralSources({
        search: false,
        social: false,
        friend: false,
        event: false,
        other: false
      });
    } catch (err: unknown) {
      setShowError(true);
      let message = 'Unknown error';
      if (err instanceof Error) {
        message = err.message;
      } else if (typeof err === 'object' && err !== null && 'message' in err) {
        const maybeMessage = (err as { message?: unknown }).message;
        message = typeof maybeMessage === 'string' ? maybeMessage : String(maybeMessage ?? 'Unknown error');
      }
      setErrorMessage(`Error creating account: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReferralChange = (source: string) => {
    setReferralSources({
      ...referralSources,
      [source]: !referralSources[source as keyof typeof referralSources]
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Success Popup */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-green-700 mb-2">Account created successfully!</h2>
              <p className="text-gray-600">Redirecting...</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card className="w-full max-w-4xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          {/* Video Section */}
          <div className="lg:w-1/2 relative h-64 lg:h-auto bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white p-8">
                <h2 className="text-3xl font-bold mb-4">Join Diamond CliP</h2>
                <p className="text-lg opacity-90">
                  The next-generation clinical communication platform
                </p>
              </div>
            </div>
          </div>
          
          {/* Form Section */}
          <div className="lg:w-1/2 p-8">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-700">
                Create your account
              </CardTitle>
              <CardDescription className="text-blue-600 font-semibold">
                Complete your information to finish your registration
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Full name *"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Email *"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger className="bg-gray-50">
                        <SelectValue placeholder="Role *" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="orthodontist">Orthodontist</SelectItem>
                        <SelectItem value="dentist">Dentist</SelectItem>
                        <SelectItem value="technician">Technician</SelectItem>
                        <SelectItem value="assistant">Assistant</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="tel"
                      placeholder="Phone number *"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Country *"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="bg-gray-50"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="City *"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="bg-gray-50"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Medical license number"
                    value={medicalLicenseNumber}
                    onChange={(e) => setMedicalLicenseNumber(e.target.value)}
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Textarea
                    placeholder="Reason for your interest in Diamond CliP"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="bg-gray-50"
                    rows={3}
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-gray-700">How did you hear about us?</p>
                  <div className="space-y-2">
                    {[
                      { key: 'search', label: 'Online search' },
                      { key: 'social', label: 'Social networks' },
                      { key: 'friend', label: 'Friend recommendation' },
                      { key: 'event', label: 'Professional event' },
                      { key: 'other', label: 'Other' }
                    ].map(({ key, label }) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={referralSources[key as keyof typeof referralSources]}
                          onCheckedChange={() => handleReferralChange(key)}
                        />
                        <label htmlFor={key} className="text-sm text-gray-700">
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {showError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create my account"}
                </Button>
              </form>
            </CardContent>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default SignupPage;