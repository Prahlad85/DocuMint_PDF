"use client";

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { motion } from 'framer-motion';

export default function ToolCard({ title, description, icon: Icon, href }) {
  return (
    <Link href={href} className="block group h-full">
      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }} className="h-full">
        <Card className="h-full border-muted/60 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <CardHeader className="p-4 sm:pb-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2 sm:mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            </div>
            <CardTitle className="text-base sm:text-xl group-hover:text-primary transition-colors leading-tight">{title}</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
            <CardDescription className="text-muted-foreground text-xs sm:text-sm line-clamp-3 sm:line-clamp-none">
              {description}
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
