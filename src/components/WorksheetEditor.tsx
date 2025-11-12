import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, FileEdit } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export interface DailyPlannerTemplate {
  title: string;
  sections: {
    name: string;
    prompts: string[];
  }[];
}

export interface HabitTrackerTemplate {
  title: string;
  habits: string[];
  trackingPeriod: "daily" | "weekly" | "monthly";
}

export interface GoalSettingTemplate {
  title: string;
  categories: {
    name: string;
    questions: string[];
  }[];
}

export interface WorksheetTemplates {
  dailyPlanner?: DailyPlannerTemplate;
  habitTracker?: HabitTrackerTemplate;
  goalSetting?: GoalSettingTemplate;
}

interface WorksheetEditorProps {
  onSave: (templates: WorksheetTemplates) => void;
  initialTemplates?: WorksheetTemplates;
}

const DEFAULT_DAILY_PLANNER: DailyPlannerTemplate = {
  title: "Daily Planner",
  sections: [
    { name: "Morning Intention", prompts: ["What is my main focus for today?", "How do I want to feel today?"] },
    { name: "Top 3 Priorities", prompts: ["Priority 1:", "Priority 2:", "Priority 3:"] },
    { name: "Evening Reflection", prompts: ["What went well today?", "What could I improve tomorrow?"] },
  ],
};

const DEFAULT_HABIT_TRACKER: HabitTrackerTemplate = {
  title: "Habit Tracker",
  habits: ["Morning Exercise", "Meditation", "Drink 8 glasses of water", "Read for 30 minutes", "Journal"],
  trackingPeriod: "daily",
};

const DEFAULT_GOAL_SETTING: GoalSettingTemplate = {
  title: "Goal Setting Framework",
  categories: [
    {
      name: "Vision",
      questions: ["What is my ultimate goal?", "Why is this important to me?", "What does success look like?"],
    },
    {
      name: "Action Steps",
      questions: ["What are 3 key steps to achieve this?", "What resources do I need?", "What obstacles might I face?"],
    },
    {
      name: "Timeline",
      questions: ["When do I want to achieve this?", "What are my milestones?", "How will I track progress?"],
    },
  ],
};

export const WorksheetEditor = ({ onSave, initialTemplates }: WorksheetEditorProps) => {
  const [dailyPlanner, setDailyPlanner] = useState<DailyPlannerTemplate>(
    initialTemplates?.dailyPlanner || DEFAULT_DAILY_PLANNER
  );
  const [habitTracker, setHabitTracker] = useState<HabitTrackerTemplate>(
    initialTemplates?.habitTracker || DEFAULT_HABIT_TRACKER
  );
  const [goalSetting, setGoalSetting] = useState<GoalSettingTemplate>(
    initialTemplates?.goalSetting || DEFAULT_GOAL_SETTING
  );
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    onSave({
      dailyPlanner,
      habitTracker,
      goalSetting,
    });
    setOpen(false);
  };

  const addDailyPlannerSection = () => {
    setDailyPlanner({
      ...dailyPlanner,
      sections: [...dailyPlanner.sections, { name: "New Section", prompts: [""] }],
    });
  };

  const updateDailyPlannerSection = (index: number, field: "name" | "prompts", value: any) => {
    const newSections = [...dailyPlanner.sections];
    if (field === "prompts") {
      newSections[index].prompts = value;
    } else {
      newSections[index].name = value;
    }
    setDailyPlanner({ ...dailyPlanner, sections: newSections });
  };

  const removeDailyPlannerSection = (index: number) => {
    setDailyPlanner({
      ...dailyPlanner,
      sections: dailyPlanner.sections.filter((_, i) => i !== index),
    });
  };

  const addHabit = () => {
    setHabitTracker({
      ...habitTracker,
      habits: [...habitTracker.habits, "New Habit"],
    });
  };

  const updateHabit = (index: number, value: string) => {
    const newHabits = [...habitTracker.habits];
    newHabits[index] = value;
    setHabitTracker({ ...habitTracker, habits: newHabits });
  };

  const removeHabit = (index: number) => {
    setHabitTracker({
      ...habitTracker,
      habits: habitTracker.habits.filter((_, i) => i !== index),
    });
  };

  const addGoalCategory = () => {
    setGoalSetting({
      ...goalSetting,
      categories: [...goalSetting.categories, { name: "New Category", questions: [""] }],
    });
  };

  const updateGoalCategory = (index: number, field: "name" | "questions", value: any) => {
    const newCategories = [...goalSetting.categories];
    if (field === "questions") {
      newCategories[index].questions = value;
    } else {
      newCategories[index].name = value;
    }
    setGoalSetting({ ...goalSetting, categories: newCategories });
  };

  const removeGoalCategory = (index: number) => {
    setGoalSetting({
      ...goalSetting,
      categories: goalSetting.categories.filter((_, i) => i !== index),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <FileEdit className="w-4 h-4 mr-2" />
          Customize Worksheets
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Customize Worksheet Templates</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="daily-planner" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily-planner">Daily Planner</TabsTrigger>
            <TabsTrigger value="habit-tracker">Habit Tracker</TabsTrigger>
            <TabsTrigger value="goal-setting">Goal Setting</TabsTrigger>
          </TabsList>

          <TabsContent value="daily-planner" className="space-y-4">
            <div>
              <Label>Template Title</Label>
              <Input
                value={dailyPlanner.title}
                onChange={(e) => setDailyPlanner({ ...dailyPlanner, title: e.target.value })}
                placeholder="Daily Planner"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Sections</h3>
                <Button onClick={addDailyPlannerSection} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Section
                </Button>
              </div>

              {dailyPlanner.sections.map((section, sectionIndex) => (
                <Card key={sectionIndex}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Input
                        value={section.name}
                        onChange={(e) => updateDailyPlannerSection(sectionIndex, "name", e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        onClick={() => removeDailyPlannerSection(sectionIndex)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {section.prompts.map((prompt, promptIndex) => (
                      <div key={promptIndex} className="flex gap-2">
                        <Input
                          value={prompt}
                          onChange={(e) => {
                            const newPrompts = [...section.prompts];
                            newPrompts[promptIndex] = e.target.value;
                            updateDailyPlannerSection(sectionIndex, "prompts", newPrompts);
                          }}
                          placeholder="Prompt question..."
                        />
                        <Button
                          onClick={() => {
                            const newPrompts = section.prompts.filter((_, i) => i !== promptIndex);
                            updateDailyPlannerSection(sectionIndex, "prompts", newPrompts);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        updateDailyPlannerSection(sectionIndex, "prompts", [...section.prompts, ""]);
                      }}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Prompt
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="habit-tracker" className="space-y-4">
            <div>
              <Label>Template Title</Label>
              <Input
                value={habitTracker.title}
                onChange={(e) => setHabitTracker({ ...habitTracker, title: e.target.value })}
                placeholder="Habit Tracker"
              />
            </div>

            <div>
              <Label>Tracking Period</Label>
              <select
                value={habitTracker.trackingPeriod}
                onChange={(e) =>
                  setHabitTracker({
                    ...habitTracker,
                    trackingPeriod: e.target.value as "daily" | "weekly" | "monthly",
                  })
                }
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Habits to Track</Label>
                <Button onClick={addHabit} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Habit
                </Button>
              </div>

              {habitTracker.habits.map((habit, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={habit}
                    onChange={(e) => updateHabit(index, e.target.value)}
                    placeholder="Habit name..."
                  />
                  <Button onClick={() => removeHabit(index)} size="sm" variant="ghost">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="goal-setting" className="space-y-4">
            <div>
              <Label>Template Title</Label>
              <Input
                value={goalSetting.title}
                onChange={(e) => setGoalSetting({ ...goalSetting, title: e.target.value })}
                placeholder="Goal Setting Framework"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium">Categories</h3>
                <Button onClick={addGoalCategory} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-1" />
                  Add Category
                </Button>
              </div>

              {goalSetting.categories.map((category, categoryIndex) => (
                <Card key={categoryIndex}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Input
                        value={category.name}
                        onChange={(e) => updateGoalCategory(categoryIndex, "name", e.target.value)}
                        className="max-w-xs"
                      />
                      <Button
                        onClick={() => removeGoalCategory(categoryIndex)}
                        size="sm"
                        variant="ghost"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {category.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="flex gap-2">
                        <Input
                          value={question}
                          onChange={(e) => {
                            const newQuestions = [...category.questions];
                            newQuestions[questionIndex] = e.target.value;
                            updateGoalCategory(categoryIndex, "questions", newQuestions);
                          }}
                          placeholder="Question..."
                        />
                        <Button
                          onClick={() => {
                            const newQuestions = category.questions.filter((_, i) => i !== questionIndex);
                            updateGoalCategory(categoryIndex, "questions", newQuestions);
                          }}
                          size="sm"
                          variant="ghost"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      onClick={() => {
                        updateGoalCategory(categoryIndex, "questions", [...category.questions, ""]);
                      }}
                      size="sm"
                      variant="outline"
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Question
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <Separator />

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Templates</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
