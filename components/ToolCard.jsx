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
          <CardHeader className="pb-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl group-hover:text-primary transition-colors">{title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-muted-foreground text-sm">
              {description}
            </CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
