"use client";

import { useState } from "react";
import { Shield, Key, Smartphone, Clock, AlertCircle } from "lucide-react";
import { changespasswordAPI } from "@/api";
import { PageHeader } from "../shared/PageHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Switch } from "../ui/switch";
import { Badge } from "../ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { toast } from "sonner";
import { Alert, AlertDescription } from "../ui/alert";

const loginHistory = [
  {
    id: 1,
    device: "Chrome on Windows",
    location: "New York, USA",
    ip: "192.168.1.1",
    time: "2024-11-07 09:42",
    status: "success",
  },
  {
    id: 2,
    device: "Safari on iPhone",
    location: "New York, USA",
    ip: "192.168.1.2",
    time: "2024-11-06 18:30",
    status: "success",
  },
  {
    id: 3,
    device: "Firefox on Mac",
    location: "Boston, USA",
    ip: "192.168.2.1",
    time: "2024-11-05 14:15",
    status: "failed",
  },
  {
    id: 4,
    device: "Chrome on Windows",
    location: "New York, USA",
    ip: "192.168.1.1",
    time: "2024-11-04 10:20",
    status: "success",
  },
];

export function Account() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [loginAlerts, setLoginAlerts] = useState(true);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsChangingPassword(true);
    try {
      await changespasswordAPI({
        oldPassword: currentPassword,
        newPassword,
      });
      toast.success("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to change password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleEnable2FA = () => {
    if (!twoFactorEnabled) {
      // In a real app, this would show QR code setup
      toast.success("2FA setup initiated. Check your email for instructions.");
      setTwoFactorEnabled(true);
    } else {
      toast.info("2FA disabled");
      setTwoFactorEnabled(false);
    }
  };

  const handleGenerateBackupCodes = () => {
    toast.success("Backup codes generated! Please save them securely.");
  };

  const handleRevokeSession = (id: number) => {
    toast.success("Session revoked successfully");
  };

  return (
    <div className="p-6">
      <PageHeader
        title="Account Security"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Account" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Password Change */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-[#2d8cf0]" />
                <CardTitle>Change Password</CardTitle>
              </div>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Password must be at least 8 characters long and include
                  uppercase, lowercase, numbers, and special characters.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                />
              </div>

              <Button
                className="bg-[#2d8cf0] hover:bg-[#2577d4]"
                onClick={handlePasswordChange}
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Updating..." : "Update Password"}
              </Button>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-[#2d8cf0]" />
                <CardTitle>Two-Factor Authentication</CardTitle>
              </div>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900">
                      Two-Factor Authentication
                    </span>
                    {twoFactorEnabled && (
                      <Badge className="bg-green-100 text-green-700">
                        Enabled
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {twoFactorEnabled
                      ? "Your account is protected with 2FA"
                      : "Secure your account with 2FA verification"}
                  </p>
                </div>
                <Switch
                  checked={twoFactorEnabled}
                  onCheckedChange={handleEnable2FA}
                />
              </div>

              {twoFactorEnabled && (
                <>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="text-sm text-gray-900 mb-2">
                      Authenticator App
                    </h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Use Google Authenticator, Authy, or similar apps to
                      generate codes
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        View QR Code
                      </Button>
                      <Button variant="outline" size="sm">
                        Copy Setup Key
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Backup Codes</Label>
                    <p className="text-sm text-gray-600">
                      Generate backup codes in case you lose access to your
                      authenticator
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleGenerateBackupCodes}
                    >
                      Generate Backup Codes
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Login History */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#2d8cf0]" />
                <CardTitle>Login History</CardTitle>
              </div>
              <CardDescription>
                Recent login attempts and active sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Device</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>IP Address</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loginHistory.map((login) => (
                    <TableRow key={login.id}>
                      <TableCell>{login.device}</TableCell>
                      <TableCell>{login.location}</TableCell>
                      <TableCell className="font-mono text-sm">
                        {login.ip}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {login.time}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            login.status === "success"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }
                        >
                          {login.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {login.id !== 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRevokeSession(login.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Revoke
                          </Button>
                        )}
                        {login.id === 1 && (
                          <Badge variant="outline" className="text-xs">
                            Current
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-[#2d8cf0]" />
                <CardTitle className="text-lg">Security Status</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Password Strength
                  </span>
                  <Badge className="bg-green-100 text-green-700">Strong</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">2FA Status</span>
                  <Badge
                    className={
                      twoFactorEnabled
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }
                  >
                    {twoFactorEnabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Last Password Change
                  </span>
                  <span className="text-sm text-gray-900">30 days ago</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm text-gray-900">
                    {loginHistory.filter((l) => l.status === "success").length}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm text-gray-900 mb-2">Security Score</h4>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <span className="text-xs text-gray-600">Good</span>
                    <span className="text-xs text-gray-900">75%</span>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                    <div
                      style={{ width: "75%" }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-[#2d8cf0]"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notif" className="cursor-pointer">
                    Email Notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Security alerts via email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={(checked: any) => {
                    setEmailNotifications(checked);
                    toast.success(
                      checked
                        ? "Email notifications enabled"
                        : "Email notifications disabled"
                    );
                  }}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="login-alerts" className="cursor-pointer">
                    Login Alerts
                  </Label>
                  <p className="text-sm text-gray-500">Alert on new logins</p>
                </div>
                <Switch
                  id="login-alerts"
                  checked={loginAlerts}
                  onCheckedChange={(checked: any) => {
                    setLoginAlerts(checked);
                    toast.success(
                      checked ? "Login alerts enabled" : "Login alerts disabled"
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-lg text-red-900">
                Danger Zone
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-red-700">
                These actions are irreversible. Please be careful.
              </p>
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
                onClick={() => toast.error("This action requires confirmation")}
              >
                Deactivate Account
              </Button>
              <Button
                variant="outline"
                className="w-full border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800"
                onClick={() => toast.error("This action requires confirmation")}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
