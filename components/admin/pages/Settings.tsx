"use client";

import React, { useState } from "react";
import { PageHeader } from "../shared/PageHeader";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Switch } from "../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import { Copy } from "lucide-react";

export function Settings() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [weeklyDigest, setWeeklyDigest] = useState(true);
  const [appName, setAppName] = useState("FitTrack Admin");
  const [adminEmail, setAdminEmail] = useState("admin@fittrack.com");
  const [timezone, setTimezone] = useState("America/New_York");
  const [language, setLanguage] = useState("en");
  const [dateFormat, setDateFormat] = useState("MM/DD/YYYY");

  const handleSaveGeneral = () => {
    toast.success("General settings saved successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText("");
    toast.success("API key copied to clipboard!");
  };

  const handleGenerateKey = () => {
    toast.success("New API key generated successfully!");
  };

  const handleRevokeKey = () => {
    toast.error("API key revoked");
  };

  return (
    <div className="p-4 lg:p-6">
      <PageHeader
        title="Settings"
        breadcrumbs={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Settings" },
        ]}
      />

      <Tabs defaultValue="general" className="space-y-4 lg:space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 lg:w-auto">
          <TabsTrigger value="general" className="text-xs lg:text-sm">
            General
          </TabsTrigger>
          <TabsTrigger value="notifications" className="text-xs lg:text-sm">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="text-xs lg:text-sm">
            Security
          </TabsTrigger>
          <TabsTrigger value="api" className="text-xs lg:text-sm">
            API Keys
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-lg lg:text-xl">
                General Settings
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Manage your application's general settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
              <div className="space-y-2">
                <Label htmlFor="appName" className="text-sm lg:text-base">
                  Application Name
                </Label>
                <Input
                  id="appName"
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  className="text-sm lg:text-base"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-sm lg:text-base">
                  Admin Email
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="text-sm lg:text-base"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone" className="text-sm lg:text-base">
                    Timezone
                  </Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger
                      id="timezone"
                      className="text-sm lg:text-base"
                    >
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/New_York">
                        Eastern Time (ET)
                      </SelectItem>
                      <SelectItem value="America/Chicago">
                        Central Time (CT)
                      </SelectItem>
                      <SelectItem value="America/Denver">
                        Mountain Time (MT)
                      </SelectItem>
                      <SelectItem value="America/Los_Angeles">
                        Pacific Time (PT)
                      </SelectItem>
                      <SelectItem value="Europe/London">
                        London (GMT)
                      </SelectItem>
                      <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm lg:text-base">
                    Language
                  </Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger
                      id="language"
                      className="text-sm lg:text-base"
                    >
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="es">Spanish</SelectItem>
                      <SelectItem value="fr">French</SelectItem>
                      <SelectItem value="de">German</SelectItem>
                      <SelectItem value="ja">Japanese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateFormat" className="text-sm lg:text-base">
                  Date Format
                </Label>
                <Select value={dateFormat} onValueChange={setDateFormat}>
                  <SelectTrigger
                    id="dateFormat"
                    className="text-sm lg:text-base"
                  >
                    <SelectValue placeholder="Select date format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                    <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                    <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm lg:text-base">
                  Application Description
                </Label>
                <Textarea
                  id="description"
                  defaultValue="A comprehensive fitness tracking platform for managing workouts, exercises, and nutrition."
                  rows={4}
                  className="text-sm lg:text-base"
                />
              </div>

              <Button
                className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base w-full sm:w-auto"
                onClick={handleSaveGeneral}
              >
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-lg lg:text-xl">
                Notification Preferences
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Choose how you want to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
              <div className="flex items-start lg:items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="email-notif" className="text-sm lg:text-base">
                    Email Notifications
                  </Label>
                  <p className="text-xs lg:text-sm text-gray-500">
                    Receive email notifications about important updates
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  className="shrink-0"
                />
              </div>

              <div className="flex items-start lg:items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label htmlFor="push-notif" className="text-sm lg:text-base">
                    Push Notifications
                  </Label>
                  <p className="text-xs lg:text-sm text-gray-500">
                    Receive push notifications in your browser
                  </p>
                </div>
                <Switch
                  id="push-notif"
                  checked={pushNotifications}
                  onCheckedChange={setPushNotifications}
                  className="shrink-0"
                />
              </div>

              <div className="flex items-start lg:items-center justify-between gap-4">
                <div className="space-y-0.5 flex-1">
                  <Label
                    htmlFor="weekly-digest"
                    className="text-sm lg:text-base"
                  >
                    Weekly Digest
                  </Label>
                  <p className="text-xs lg:text-sm text-gray-500">
                    Get a weekly summary of platform activity
                  </p>
                </div>
                <Switch
                  id="weekly-digest"
                  checked={weeklyDigest}
                  onCheckedChange={setWeeklyDigest}
                  className="shrink-0"
                />
              </div>

              <Button
                className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base w-full sm:w-auto"
                onClick={handleSaveNotifications}
              >
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-lg lg:text-xl">
                Security Settings
              </CardTitle>
              <CardDescription className="text-sm lg:text-base">
                For advanced security settings, please visit the{" "}
                <a href="/account" className="text-[#2d8cf0] hover:underline">
                  Account Security
                </a>{" "}
                page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm lg:text-base text-gray-900 mb-2">
                  Password & Authentication
                </h4>
                <p className="text-xs lg:text-sm text-gray-600 mb-4">
                  Manage your password, enable two-factor authentication, and
                  view login history
                </p>
                <Button
                  onClick={() => (window.location.href = "/account")}
                  className="bg-[#2d8cf0] hover:bg-[#2577d4] text-sm lg:text-base w-full sm:w-auto"
                >
                  Go to Account Security
                </Button>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm lg:text-base text-gray-900">
                  Session Management
                </h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm lg:text-base text-gray-900">
                      Active Sessions
                    </p>
                    <p className="text-xs lg:text-sm text-gray-500">
                      You have 3 active sessions
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto"
                  >
                    Manage
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm lg:text-base text-gray-900">
                  Data & Privacy
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <Label
                        htmlFor="data-collection"
                        className="text-sm lg:text-base"
                      >
                        Allow Analytics
                      </Label>
                      <p className="text-xs lg:text-sm text-gray-500">
                        Help improve the platform
                      </p>
                    </div>
                    <Switch
                      id="data-collection"
                      defaultChecked
                      className="shrink-0"
                    />
                  </div>
                  <div className="flex items-start lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <Label
                        htmlFor="activity-log"
                        className="text-sm lg:text-base"
                      >
                        Activity Logging
                      </Label>
                      <p className="text-xs lg:text-sm text-gray-500">
                        Track your admin activities
                      </p>
                    </div>
                    <Switch
                      id="activity-log"
                      defaultChecked
                      className="shrink-0"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader className="p-4 lg:p-6">
              <CardTitle className="text-lg lg:text-xl">API Keys</CardTitle>
              <CardDescription className="text-sm lg:text-base">
                Manage your API keys for external integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 lg:space-y-6 p-4 lg:p-6">
              <div className="space-y-2">
                <Label htmlFor="api-key" className="text-sm lg:text-base">
                  Production API Key
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    defaultValue="sample_production"
                    readOnly
                    className="font-mono text-xs lg:text-sm bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyApiKey}
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs lg:text-sm text-gray-500">
                  Keep your API key secret. Do not share it publicly.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key-test" className="text-sm lg:text-base">
                  Test API Key
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key-test"
                    defaultValue="sk_test_7fD28GhKmNpQrStUvWxYz"
                    readOnly
                    className="font-mono text-xs lg:text-sm bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyApiKey}
                    className="shrink-0"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs lg:text-sm text-gray-500">
                  Use this key for development and testing purposes.
                </p>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <h4 className="text-sm lg:text-base text-gray-900 mb-3">
                  API Usage Statistics
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs lg:text-sm text-gray-500">
                      Requests Today
                    </p>
                    <p className="text-lg lg:text-xl text-gray-900">1,247</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs lg:text-sm text-gray-500">
                      This Month
                    </p>
                    <p className="text-lg lg:text-xl text-gray-900">34,892</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs lg:text-sm text-gray-500">
                      Rate Limit
                    </p>
                    <p className="text-lg lg:text-xl text-gray-900">10K/hr</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto text-sm lg:text-base"
                    onClick={handleGenerateKey}
                  >
                    Generate New Key
                  </Button>
                  <Button
                    variant="outline"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 w-full sm:w-auto text-sm lg:text-base"
                    onClick={handleRevokeKey}
                  >
                    Revoke Key
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
