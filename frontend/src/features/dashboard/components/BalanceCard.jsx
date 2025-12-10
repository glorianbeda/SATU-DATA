import React from 'react';
import { useTranslation } from 'react-i18next';

const BalanceCard = ({ balance = 0, income = 0, expense = 0 }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-blue-600 dark:bg-blue-700 p-6 rounded-2xl shadow-lg text-white relative overflow-hidden transition-colors duration-300">
            <div className="relative z-10">
                <p className="text-blue-100 dark:text-blue-200 text-sm font-medium mb-1">{t('dashboard.balance_card.title')}</p>
                <h2 className="text-4xl font-bold mb-4">Rp {balance.toLocaleString()}</h2>

                <div className="flex gap-4 mt-4">
                    <div className="bg-blue-500/30 dark:bg-blue-600/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-blue-100 dark:text-blue-200">{t('dashboard.balance_card.income')}</p>
                        <p className="font-semibold text-sm">+ Rp {income.toLocaleString()}</p>
                    </div>
                    <div className="bg-blue-500/30 dark:bg-blue-600/40 px-3 py-1.5 rounded-lg backdrop-blur-sm">
                        <p className="text-xs text-blue-100 dark:text-blue-200">{t('dashboard.balance_card.expense')}</p>
                        <p className="font-semibold text-sm">- Rp {expense.toLocaleString()}</p>
                    </div>

                </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 dark:bg-blue-600 rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-400 dark:bg-blue-500 rounded-full opacity-20 blur-xl"></div>
        </div>
    );
};

export default BalanceCard;

