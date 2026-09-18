import SubHead from "../Atoms/subhead";
import Paragraph from "../Atoms/paragraph";
import { motion } from "framer-motion";

export default function FinalCTA() {
  return (
    <div className="bg-primary-100 overflow-hidden">
      <div className="container mx-auto max-w-[1344px]">
        <div className="px-5 py-20 flex flex-col items-center gap-10 sm:px-10 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center flex flex-col items-center gap-8"
          >
            <SubHead color="text-white" style="sm:w-8/12 lg:w-6/12">
              Ready to start selling online?
            </SubHead>
            <Paragraph fontSize="text-lg" color="text-white/80" style="sm:w-4/5 lg:w-3/5">
              Join thousands of businesses already using Drawcaf to grow their revenue. Start your free trial today.
            </Paragraph>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="w-full relative rounded-2xl overflow-hidden shadow-2xl"
          >
            <div className="relative aspect-video md:aspect-[21/9] lg:aspect-[2.5/1]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                src="/sell-international.webm"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary-100/90 via-primary-100/30 to-transparent" />
              <div className="absolute inset-0 flex flex-col items-center justify-end pb-10 px-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <button className="bg-white text-primary-100 px-8 py-4 font-head font-bold text-lg hover:bg-tertiary-200 transition-all duration-200">
                    START FREE TRIAL
                  </button>
                  <button className="border-2 border-white text-white px-8 py-4 font-head font-bold text-lg hover:bg-white hover:text-primary-100 transition-all duration-200">
                    SCHEDULE A DEMO
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
