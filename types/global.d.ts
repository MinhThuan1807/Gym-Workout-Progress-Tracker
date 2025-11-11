declare global {
    type SignInFormData = {
        email: string;
        password: string;
    };
    type SignUpFormData = {
        email: string;
        password: string;
        confirmPassword: string;
    }

    type FormInputProps = {
        name: string;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<SignUpFormData>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    }   
    type FormCheckoutInputProps = {
        name: keyof CheckoutFormData;
        label: string;
        placeholder: string;
        type?: string;
        register: UseFormRegister<CheckoutFormData>;
        error?: FieldError;
        validation?: RegisterOptions;
        disabled?: boolean;
        value?: string;
    }   
    type FooterLinkProps = {
        text: string;
        linkText: string;
        href: string;
    }

    interface User {
        _id: string;
        email: string;
        displayName?: string;
        role: string;
        gender?: string;
        dob?: Date;
        heightCm?: number;
        weightKg?: number;
        avatar?: string;
        verifyToken: string | null;
        token: string;
        createAt: Date;
        updateAt: Date;
    }

    interface AuthUser {
        _id: string;
        email: string;
        displayName?: string;
        role: string;
        avatar?: string;
    }

    interface Exercise {
        _id: number;
        name: string;
        type: 'Strength' | 'Cardio' | 'Calisthenics' | 'Mobility' | 'Flexibility';
        difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
        muscleGroup: string;
        secondaryMuscles?: string[];
        equipment: string;
        description: string;
        mediaImageUrl: string;
        mediaVideoUrl?: string;
    }
    interface Goal {
        _id: string;
        type: GoalType;
        name: string;
        startValue?: number;
        currentValue: number;
        targetValue: number;
        unit: string;
        status: GoalStatus;
        startDate: string;
        targetDate?: string;
        linkedExerciseId?: number;
        linkedExerciseName?: string;
        notes?: string;
    }

    interface Achievement {
        _id: string;
        name: string;
        description: string;
        icon: string;
        unlocked: boolean;
        progress?: number;
        requirement?: number;
        color?: string;
    }

    interface UserProfile {
        displayName: string;
        email: string;
        gender?: 'male' | 'female' | 'other';
        dob?: string;
        heightCm?: number;
        weightKg?: number;
        avatarUrl?: string;
        role: string;
    }
    interface MetricEntry {
        _id: string;
        metricCode: MetricType;
        value: number;
        unit: string;
        note?: string;
        measureAt: string;
    }

    interface MetricConfig {
        name: string;
        unit: string;
        metricCode: MetricType;
        category: 'weight' | 'body_composition' | 'measurements' | 'vitals';
        goalDirection?: 'up' | 'down';
        color: string;
    }

    interface PlanExercise {
        _id: string;
        exerciseId: number;
        exerciseName: string;
        exerciseThumbnail: string;
        targetSets: number;
        repsMin: number;
        repsMax: number;
        targetWeight?: number;
        restTime?: number;
        tempo?: string;
    }

    interface WorkoutPlan {
        _id: string;
        name: string;
        goalHint: string;
        isActive: boolean;
        startDate?: string;
        endDate?: string;
        weeklySchedule: {
            sunday: PlanExercise[];
            monday: PlanExercise[];
            tuesday: PlanExercise[];
            wednesday: PlanExercise[];
            thursday: PlanExercise[];
            friday: PlanExercise[];
            saturday: PlanExercise[];
        };
    }

    interface ExerciseSet {
        setNumber: number;
        reps: number;
        weight: number;
        rpe?: number;
        isWarmup: boolean;
    }

    interface SessionExercise {
        exerciseId: number;
        exerciseName: string;
        sets: ExerciseSet[];
    }

    interface WorkoutSession {
        _id: string;
        startTime: string;
        endTime?: string;
        planId?: string;
        planName?: string;
        exercises: SessionExercise[];
        mood?: 'happy' | 'neutral' | 'sad';
        energyLevel?: number;
        notes?: string;
    }
    // ===== TYPES =====
    type MetricType = 
        | 'weight'
        | 'height'
        | 'body_fat'
        | 'muscle_mass'
        | 'BMI'
        | 'waist_circumference'
        | 'hip_circumference'
        | 'blood_pressure'
        | 'heart_rate'

    type MetricCategory = 'weight' | 'bodyFat' | 'measurements' | 'vitals';
}
export {};