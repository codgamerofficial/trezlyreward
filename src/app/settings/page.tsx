
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { createClient } from '@/lib/supabase-client';
import type { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { toast } = useToast();
  const supabase = createClient();
  const router = useRouter();

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
            router.push('/login');
            return;
        }
        setUser(user);
        
        const storedAvatar = localStorage.getItem('userAvatar');
        if (storedAvatar) setAvatarPreview(storedAvatar);

        const storedBanner = localStorage.getItem('userBanner');
        if (storedBanner) setBannerPreview(storedBanner);
    };
    fetchUser();
    
    const darkMode = document.documentElement.classList.contains('dark');
    setIsDarkMode(darkMode);
  }, [router, supabase]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'avatar') {
          setAvatarPreview(reader.result as string);
        } else {
          setBannerPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSave = () => {
    if (avatarPreview) {
      localStorage.setItem('userAvatar', avatarPreview);
    }
    if (bannerPreview) {
      localStorage.setItem('userBanner', bannerPreview);
    }
    toast({
        title: 'Profile Updated',
        description: 'Your new images have been saved.',
    });
    router.refresh();
  }

  const handleThemeChange = (checked: boolean) => {
    setIsDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    toast({
      title: 'Theme Changed',
      description: `Switched to ${checked ? 'dark' : 'light'} mode.`,
    });
  };
  
  const handleClearData = () => {
    localStorage.removeItem('userInvestment');
    localStorage.removeItem('userNfts');
    localStorage.removeItem('trendingNfts');
    localStorage.removeItem('virtualCashBalance');
    localStorage.removeItem('virtualPortfolio');
    localStorage.removeItem('reminders');
    localStorage.removeItem('userAvatar');
    localStorage.removeItem('userBanner');
    toast({
        title: 'Local Data Cleared',
        description: 'All your locally stored data has been wiped.',
    });
    router.refresh();
    setAvatarPreview(null);
    setBannerPreview(null);
  };

  if (!user) {
    return <div className="flex justify-center items-center h-[80vh]">Loading...</div>;
  }
  
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  const userEmail = user.email || 'No email provided';

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl sm:text-4xl font-bold font-headline text-primary">Settings</h1>
        <p className="mt-2 text-md sm:text-lg text-muted-foreground">
          Manage your account and application preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>This is how others will see you on the site.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" defaultValue={userName} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue={userEmail} disabled />
          </div>
        </CardContent>
        <CardFooter>
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

       <Card>
        <CardHeader>
          <CardTitle>Customize Profile</CardTitle>
          <CardDescription>Change your profile picture and banner.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 rounded-full bg-muted">
                <Image
                  src={avatarPreview || "https://placehold.co/200x200.png"}
                  alt="Avatar Preview"
                  fill
                  className="rounded-full object-cover"
                />
              </div>
              <Button variant="outline" onClick={() => avatarInputRef.current?.click()}>
                Upload Image
              </Button>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileChange(e, 'avatar')}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Profile Banner</Label>
             <div className="flex items-center gap-4">
                <div className="relative w-48 h-20 rounded-md bg-muted">
                     <Image
                      src={bannerPreview || "https://placehold.co/1200x400.png"}
                      alt="Banner Preview"
                      fill
                      className="rounded-md object-cover"
                    />
                </div>
                 <Button variant="outline" onClick={() => bannerInputRef.current?.click()}>
                    Upload Image
                </Button>
                <input
                    ref={bannerInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 'banner')}
                />
             </div>
          </div>
        </CardContent>
        <CardFooter>
            <Button onClick={handleImageSave}>Save Images</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex flex-col space-y-1">
              <span>Dark Mode</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Enjoy a darker, more comfortable reading experience at night.
              </span>
            </Label>
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={handleThemeChange}
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your locally stored application data.</CardDescription>
        </CardHeader>
        <CardContent>
           <div className="flex items-center justify-between">
            <Label htmlFor="clear-data" className="flex flex-col space-y-1">
              <span>Clear Local Data</span>
              <span className="font-normal leading-snug text-muted-foreground">
                This will reset your virtual portfolio, investments, and calendar reminders. This action cannot be undone.
              </span>
            </Label>
             <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Clear Data</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete all your local data, including virtual trading portfolio, investment plans, and calendar reminders. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleClearData}>Yes, clear data</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
