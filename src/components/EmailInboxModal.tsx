import React, { useState } from 'react';
import { X, Mail, CheckCheck, Copy, Printer, Search, RefreshCw, Send } from 'lucide-react';
import { TransactionEmail } from '../types';

interface EmailInboxModalProps {
  emails: TransactionEmail[];
  onClose: () => void;
  onMarkAllAsRead: () => void;
}

export const EmailInboxModal: React.FC<EmailInboxModalProps> = ({
  emails,
  onClose,
  onMarkAllAsRead,
}) => {
  const [selectedEmailId, setSelectedEmailId] = useState<string>(emails[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNotification, setCopiedNotification] = useState(false);

  const filteredEmails = emails.filter((e) =>
    e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.bookingId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeEmail = emails.find((e) => e.id === selectedEmailId) || emails[0];

  const handleCopyEmail = () => {
    if (!activeEmail) return;
    try {
      navigator.clipboard.writeText(activeEmail.htmlBody);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 2000);
    } catch {
      // ignore
    }
  };

  const handlePrintEmail = () => {
    if (!activeEmail) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head><title>${activeEmail.subject}</title></head>
          <body style="padding: 20px;">${activeEmail.htmlBody}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-xl">
      <div 
        className="relative w-full max-w-5xl bg-slate-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden my-auto text-slate-100 flex flex-col h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar */}
        <div className="bg-white/5 px-6 py-4 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white">
                Automated Transaction Email Dispatcher
              </h3>
              <p className="text-xs text-slate-400">
                Live transactional inbox for Ung Chhayarith Resort confirmations & receipts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onMarkAllAsRead}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5"
              title="Mark all as read"
            >
              <CheckCheck className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Mark All Read</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main 2-Column Mail Layout */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Email List Sidebar */}
          <div className="md:col-span-4 bg-slate-950/60 border-r border-white/10 flex flex-col overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search emails or Ref ID..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-white/5">
              {filteredEmails.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-500">
                  No emails match your query.
                </div>
              ) : (
                filteredEmails.map((email) => {
                  const isSelected = email.id === activeEmail?.id;
                  return (
                    <div
                      key={email.id}
                      onClick={() => setSelectedEmailId(email.id)}
                      className={`p-4 cursor-pointer transition-colors space-y-1 ${
                        isSelected
                          ? 'bg-emerald-500/10 border-l-4 border-emerald-400'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-slate-300 truncate max-w-[150px]">
                          {email.recipientName}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {new Date(email.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h5 className="text-xs font-semibold text-white truncate">
                        {email.subject}
                      </h5>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[10px] text-emerald-400 font-mono">
                          #{email.bookingId}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          email.emailType === 'booking_confirmation'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-red-500/20 text-red-400'
                        }`}>
                          {email.emailType.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Email Preview Reader Pane */}
          <div className="md:col-span-8 bg-slate-950/40 flex flex-col overflow-hidden">
            {activeEmail ? (
              <>
                {/* Email Header */}
                <div className="p-4 sm:p-6 bg-white/5 border-b border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-serif font-bold text-white">
                      {activeEmail.subject}
                    </h4>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCopyEmail}
                        className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-semibold border border-white/10 flex items-center gap-1.5"
                      >
                        <Copy className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{copiedNotification ? 'Copied!' : 'Copy Body'}</span>
                      </button>
                      <button
                        onClick={handlePrintEmail}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 border border-white/10"
                        title="Print Email Ticket"
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs text-slate-400 space-y-1">
                    <p>From: <strong>Ung Chhayarith Concierge &lt;reservations@ungchhayarith.com&gt;</strong></p>
                    <p>To: <strong>{activeEmail.recipientName} &lt;{activeEmail.recipientEmail}&gt;</strong></p>
                    <p>Dispatched: <strong>{new Date(activeEmail.sentAt).toLocaleString()}</strong></p>
                  </div>
                </div>

                {/* Rendered HTML Body Frame */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-950/40">
                  <div 
                    className="max-w-2xl mx-auto rounded-2xl shadow-xl overflow-hidden bg-white text-slate-900"
                    dangerouslySetInnerHTML={{ __html: activeEmail.htmlBody }}
                  />
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-slate-500 text-xs">
                Select an email to preview contents.
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
