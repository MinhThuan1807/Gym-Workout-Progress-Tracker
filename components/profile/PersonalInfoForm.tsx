import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Ruler, Weight, User } from 'lucide-react';

interface PersonalInfoFormProps {
  profile: User;
}

export function PersonalInfoForm({ profile }: PersonalInfoFormProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dob: Date) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Card className="rounded-2xl border-[#e5e7eb] shadow-sm bg-white">
      <CardHeader>
        <CardTitle className="text-[#111827] pt-3">Personal Information</CardTitle>
        <p className="text-sm text-[#6b7280]">Your profile details</p>
      </CardHeader>
      <CardContent className="pb-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-10 h-10 rounded-lg bg-[#10b981]/10 flex items-center justify-center">
              <User className="w-5 h-5 text-[#10b981]" />
            </div>
            <div>
              <p className="text-xs text-[#6b7280]">Gender</p>
              <p className="text-sm text-[#111827] font-medium capitalize">{profile.gender}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-10 h-10 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#3b82f6]" />
            </div>
            <div>
              <p className="text-xs text-[#6b7280]">Age</p>
              <p className="text-sm text-[#111827] font-medium">
                {calculateAge(profile.dob)} years
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-10 h-10 rounded-lg bg-[#f59e0b]/10 flex items-center justify-center">
              <Ruler className="w-5 h-5 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-xs text-[#6b7280]">Height</p>
              <p className="text-sm text-[#111827] font-medium">{profile.heightCm} cm</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-10 h-10 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center">
              <Weight className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <div>
              <p className="text-xs text-[#6b7280]">Weight</p>
              <p className="text-sm text-[#111827] font-medium">{profile.weightKg} kg</p>
            </div>
          </div>

          <div className="col-span-2 flex items-center gap-3 p-4 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
            <div className="w-10 h-10 rounded-lg bg-[#ec4899]/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#ec4899]" />
            </div>
            <div>
              <p className="text-xs text-[#6b7280]">Date of Birth</p>
              <p className="text-sm text-[#111827] font-medium">{formatDate(profile.dob)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}