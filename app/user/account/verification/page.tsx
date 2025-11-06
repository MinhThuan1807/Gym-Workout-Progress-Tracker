'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter, redirect } from 'next/navigation';
import { authAPI } from '@/api/auth';

export default function VerificationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Lấy params từ URL
      const email = searchParams.get('email');
      const token = searchParams.get('token');

      // Validate params
      if (!email || !token) {
        setStatus('error');
        setMessage('Link xác thực không hợp lệ');
        return;
      }

      try {
        // Gọi API verify
        await authAPI.verifyEmail(email,token);
        
        setStatus('success');
        setMessage('Xác thực email thành công!');
        
        // Redirect về login sau 3 giây
        setTimeout(() => {
        //   router.push('user/login?verified=true');
          redirect('/user/login?verified=true');
        }, 3000);
        
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Xác thực thất bại. Token có thể đã hết hạn.');
      }
    };

    verifyEmail();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {status === 'loading' && (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold mb-2">Đang xác thực...</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">✓</div>
            <h2 className="text-xl font-semibold mb-2 text-green-600">
              {message}
            </h2>
            <p className="text-gray-600 mb-4">
              Bạn sẽ được chuyển đến trang đăng nhập...
            </p>
            <button
              onClick={() => router.push('user/login')}
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
            >
              Đăng nhập ngay
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">✕</div>
            <h2 className="text-xl font-semibold mb-2 text-red-600">
              Xác thực thất bại
            </h2>
            <p className="text-gray-600 mb-4">{message}</p>
            <div className="space-y-2">
              <button
                onClick={() => router.push('/resend-verification')}
                className="w-full bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              >
                Gửi lại email xác thực
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full border border-gray-300 px-6 py-2 rounded hover:bg-gray-50"
              >
                Về trang chủ
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}