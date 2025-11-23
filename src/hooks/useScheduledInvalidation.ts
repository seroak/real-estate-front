import { useEffect } from "react";
import { useQueryClient, QueryKey } from "@tanstack/react-query";

export function useScheduledInvalidation(targetHour: number, queryKey: QueryKey) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const now = new Date();
    const targetTime = new Date(now);

    // 목표 시간 설정
    targetTime.setHours(targetHour, 0, 0, 0);

    // 이미 목표 시간이 지났다면 내일 같은 시간으로 설정
    if (now.getTime() > targetTime.getTime()) {
      targetTime.setDate(targetTime.getDate() + 1);
    }

    const timeUntilTarget = targetTime.getTime() - now.getTime();

    console.log(
      `[ScheduledInvalidation] 다음 갱신 예정 시간: ${targetTime.toLocaleString()} (약 ${Math.round(
        timeUntilTarget / 1000 / 60
      )}분 후)`
    );

    let dailyIntervalId: NodeJS.Timeout | null = null;

    const timerId = setTimeout(() => {
      console.log(`[ScheduledInvalidation] ${targetHour}시가 되어 쿼리를 무효화합니다.`);
      queryClient.invalidateQueries({ queryKey });

      dailyIntervalId = setInterval(() => {
        console.log(`[ScheduledInvalidation] ${targetHour}시 정기 갱신 (24시간 경과)`);
        queryClient.invalidateQueries({ queryKey });
      }, 24 * 60 * 60 * 1000);

      // cleanup function for the interval inside the timeout
      // This return is not directly used by setTimeout, but the intervalId is captured by the useEffect cleanup.
    }, timeUntilTarget);

    return () => {
      clearTimeout(timerId);
      if (dailyIntervalId) {
        clearInterval(dailyIntervalId);
      }
    };
  }, [targetHour, queryClient, queryKey]); // queryKey가 바뀌면 타이머 재설정
}
