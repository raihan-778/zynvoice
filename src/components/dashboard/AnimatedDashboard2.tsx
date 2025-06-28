
// 📁 components/dashboard/AnimatedDashboard.tsx (CONTINUATION)

/*
 'use client';

// import { motion } from 'framer-motion';
// import { AnimatedContainer } from '@/components/animations/AnimatedContainer';
// import { AnimatedCard } from '@/components/animations/AnimatedCard';
// import { AnimatedList } from '@/components/animations/AnimatedList';
// import { FileText, DollarSign, Users, TrendingUp, Eye, Edit, Trash2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';

// const stats = [
//   { title: 'Total Invoices', value: '1,234', icon: FileText, change: '+12%' },
//   { title: 'Revenue', value: '$45,678', icon: DollarSign, change: '+8%' },
//   { title: 'Clients', value: '89', icon: Users, change: '+15%' },
//   { title: 'Growth', value: '23%', icon: TrendingUp, change: '+5%' }
// ];

// const recentInvoices = [
//   { id: 'INV-001', client: 'Acme Corp', amount: '$2,500', status: 'paid', date: '2024-01-15' },
//   { id: 'INV-002', client: 'Tech Solutions', amount: '$1,800', status: 'pending', date: '2024-01-14' },
//   { id: 'INV-003', client: 'Design Studio', amount: '$3,200', status: 'overdue', date: '2024-01-13' },
//   { id: 'INV-004', client: 'StartupXYZ', amount: '$950', status: 'draft', date: '2024-01-12' },
// ];

// export function AnimatedDashboard() {
//   return (
//     <AnimatedContainer>
//       <div className="space-y-8">
//         {/* Stats Grid */}
//         <motion.div 
//           className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
//           variants={{
//             hidden: { opacity: 0 },
//             show: {
//               opacity: 1,
//               transition: {
//                 staggerChildren: 0.1
//               }
//             }
//           }}
//           initial="hidden"
//           animate="show"
//         >
//           {stats.map((stat, index) => (
//             <AnimatedCard key={stat.title} delay={index * 0.1}>
//               <div className="p-6">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-muted-foreground">
//                       {stat.title}
//                     </p>
//                     <p className="text-2xl font-bold">{stat.value}</p>
//                     <p className="text-xs text-green-600 font-medium">
//                       {stat.change} from last month
//                     </p>
//                   </div>
//                   <div className="h-12 w-12 bg-primary/10 rounded-lg flex items-center justify-center">
//                     <stat.icon className="h-6 w-6 text-primary" />
//                   </div>
//                 </div>
//               </div>
//             </AnimatedCard>
//           ))}
//         </motion.div>

//         {/* Recent Invoices */}
//         <AnimatedCard delay={0.4}>
//           <div className="p-6">
//             <div className="flex items-center justify-between mb-6">
//               <h3 className="text-lg font-semibold">Recent Invoices</h3>
//               <Button variant="outline" size="sm">
//                 View All
//               </Button>
//             </div>
            
//             <AnimatedList>
//               {recentInvoices.map((invoice, index) => (
//                 <motion.div
//                   key={invoice.id}
//                   className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
//                   whileHover={{ scale: 1.02 }}
//                   whileTap={{ scale: 0.98 }}
//                 >
//                   <div className="flex items-center space-x-4">
//                     <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
//                       <FileText className="h-5 w-5 text-primary" />
//                     </div>
//                     <div>
//                       <p className="font-medium">{invoice.id}</p>
//                       <p className="text-sm text-muted-foreground">{invoice.client}</p>
//                     </div>
//                   </div>
                  
//                   <div className="flex items-center space-x-4">
//                     <div className="text-right">
//                       <p className="font-semibold">{invoice.amount}</p>
//                       <p className="text-xs text-muted-foreground">{invoice.date}</p>
//                     </div>
                    
//                     <Badge 
//                       variant={
//                         invoice.status === 'paid' ? 'default' :
//                         invoice.status === 'pending' ? 'secondary' :
//                         invoice.status === 'overdue' ? 'destructive' : 'outline'
//                       }
//                     >
//                       {invoice.status}
//                     </Badge>
                    
//                     <div className="flex space-x-1">
//                       <Button variant="ghost" size="sm">
//                         <Eye className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Edit className="h-4 w-4" />
//                       </Button>
//                       <Button variant="ghost" size="sm">
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 </motion.div>
//               ))}
//             </AnimatedList>
//           </div>
//         </AnimatedCard>
//       </div>
//     </AnimatedContainer>
//   );
// }