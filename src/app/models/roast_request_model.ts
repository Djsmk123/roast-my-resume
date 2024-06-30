
import z from 'zod';

const roastRequestSchema = z.object({
    roastLevel: z.string().min(0).max(3).default('3'),
    file: z.instanceof(File).optional(),
    textBasedResume: z.string().optional(),

});
export default roastRequestSchema;