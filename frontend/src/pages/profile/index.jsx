import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ProfileEditForm from '~/features/profile/components/ProfileEditForm';
import ChangePasswordForm from '~/features/profile/components/ChangePasswordForm';
import { useLayout } from '~/context/LayoutContext';
import { motion } from 'motion/react';

const ProfilePage = () => {
  const { t } = useTranslation();
  const { setTitle } = useLayout();

  useEffect(() => {
    setTitle(t('profile.title'));
  }, [t, setTitle]);

  return (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
    >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
        <div className="flex flex-col gap-8">
            <ProfileEditForm />
        </div>
        <div className="flex flex-col gap-8">
            <ChangePasswordForm />
        </div>
        </div>
    </motion.div>
  );
};

export default ProfilePage;
